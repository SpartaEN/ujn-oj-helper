# ujn-oj-helper

济大 OJ 助手 用来偷跑题目

## 写在前面

由于本人已经大二下学期，可能再也不会用到 OJ 了，因此将之前的偷跑器开源，留给有需要的人。

## 使用方法

安装依赖项

```
npm i
```

爬取当前题库到数据库

```
node index get 1000 2000
```

搜索存在于 `Contest 3556` 中的题目

```
node index search 1000 2000 "Contest 3556"
```

## LICENSE

```
Copyright 2019-2021 Sparta_EN<nya@sparta-en.org>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
