"use strict";
const request = require("request");
const cheerio = require("cheerio");
const simpleLogger = require('./simpleLogger');
const db = require('./db');
const extractor = {
    NOT_AVAILABLE: /Problem is not Available!!/,
    USED: /This problem is in Contest\(s\) below/,
    NO_PRIV: /This is a private contest which you don't have privilege/,
    GET_PROBLEM: /href=(problem.php\?cid=[0-9]+&pid=[0-9]+)>/
};
var logger = new simpleLogger({
    CONSOLE: true,
    DEBUG: true,
    FILEPATH: "./main.log"
})

function requestPage(problemId) {
    return new Promise((resolve, reject) => {
        request.get(
            `http://acm.ujn.edu.cn/JudgeOnline/problem.php?id=${problemId}`, {
            headers: {
                "User-Agent": "MeowBot",
            },
        },
            (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode !== 200) {
                        reject(new Error(`Invalid status code: ${res.statusCode}`));
                    } else {
                        resolve(body);
                    }
                }
            }
        );
    });
}

function requestContestProblem(payload) {
    return new Promise((resolve, reject) => {
        request.get(
            `http://acm.ujn.edu.cn/JudgeOnline/${payload}`, {
            headers: {
                "User-Agent": "MeowBot",
            },
        },
            (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    if (res.statusCode !== 200) {
                        reject(new Error(`Invalid status code: ${res.statusCode}`));
                    } else {
                        resolve(body);
                    }
                }
            }
        );
    });
}

function query(sql, val) {
    return new Promise((resolve, reject) => {
        db.query(sql, val, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

async function getProblems(from, to) {
    logger.info(`Fetching problems from ${from} to ${to}`);
    from = Number.parseInt(from);
    to = Number.parseInt(to);
    for (var i = from; i <= to; i++) {
        var result = await query("SELECT * FROM problems WHERE id = ?", i);
        if (result.length != 0 && result[0].status === 0) {
            logger.info(`Problem ${i} has exists in database`)
            continue;
        }
        var data = await requestPage(i);
        if (extractor.USED.test(data)) {
            logger.info(`Problem ${i} is currently on contest, trying to fetch manually`);
            var capture = extractor.GET_PROBLEM.exec(data);
            if (capture[1]) {
                data = await (requestContestProblem(capture[1]));
                if (extractor.NO_PRIV.test(data)) {
                    logger.warn(`Manual operation required for problem ${i}`);
                    await query("INSERT INTO problems VALUES(?, ?, ?)", [i, 1, ""]);
                    continue;
                }
            } else {
                logger.warn(`Manual operation required for problem ${i}`);
                await query("INSERT INTO problems VALUES(?, ?, ?)", [i, 1, ""]);
                continue;
            }
        }
        if (extractor.NOT_AVAILABLE.test(data)) {
            logger.warn(`Problem ${i} not available`);
            continue;
        }
        // var $ = cheerio.load(data);
        // $("")
        await query("INSERT INTO problems VALUES(?, ?, ?)", [i, 0, data]);
        logger.info(`Archived problem ${i}`);
    }
    logger.info("Completed");
}

async function searchContest(from, to, dest) {
    logger.info(`Searching problems from ${from} to ${to} for ${dest}`);
    var result = [];
    for (var i = from; i <= to; i++) {
        var data = await requestPage(i);
        if (extractor.NOT_AVAILABLE.test(data)) {
            logger.warn(`Problem ${i} not available`)
            continue;
        }
        if (dest !== "") {
            if (data.includes(dest)) {
                logger.info(`Find problem ${i}`);
                result.push(i);
            }
        } else {
            if (extractor.USED.test(data)) {
                logger.info(`Find problem ${i}`);
                result.push(i);
            }
        }
    }
    var str = "";
    for (var i = 0; i < result.length; i++) {
        str += ` ${result[i]}`;
    }
    logger.info(`Found ${result.length} problems:${str}`);
}

if (process.argv[2] === "get") {
    var from = process.argv[3] || 1000;
    var to = process.argv[4] || 2000;
    getProblems(from, to);
} else if (process.argv[2] === "search") {
    var from = process.argv[3] || 1000;
    var to = process.argv[4] || 2000;
    var dest = process.argv[5] || "";
    console.log(dest)
    searchContest(from, to, dest);
} else {
    console.log("Unknow operation");
}
