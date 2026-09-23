# crew-ai-demo-1 — 根据人名了解人员信息

> 一个最小可运行的 **CrewAI** 示例：给定一个名字，Agent 自动联网搜索公开资料，输出结构化人物简介。

---

## 它做了什么

输入人名 → 由两个 Agent 协作完成：

| Agent | 职责 | 工具 |
| --- | --- | --- |
| **Researcher（研究员）** | 围绕人名调取事实，每条事实附 URL | `SerperDevTool`（Google 搜索） |
| **Writer（撰写员）** | 把事实清单改写为结构化中文简介 | — |

任务按 `Process.sequential` 顺序执行：先搜集 → 再撰写。

输出结构固定为：

```
## 身份定位
## 主要履历
## 代表性成就
## 近期动态
## 参考来源
```

---

## 目录结构

```
crew-ai-demo-1/
├── README.md        # 本文件
├── requirements.txt # crewai / crewai-tools / python-dotenv
├── .env.example     # 需要的环境变量样例
├── .gitignore
├── main.py          # CLI 入口
├── crew.py          # Crew 组装
├── agents.py        # 两个 Agent 定义
├── tasks.py         # 两个 Task 定义
├── tools.py         # 联网搜索工具 + 环境变量体检
└── output/          # --save 时把结果写入这里
```

模块拆分的目的是方便你把单文件 demo 演进成多源 / 多 Agent 的复杂 Crew，
不用回头重写一遍。

---

## 快速开始

### 1. 安装依赖

建议使用虚拟环境：

```bash
cd aiagent/crew-ai-demo-1
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

需要准备：

| 变量 | 是否必填 | 用途 |
| --- | --- | --- |
| `OPENAI_API_KEY` | ✅ | LLM 网关 key，OpenAI 兼容协议 |
| `OPENAI_API_BASE` | ⛔ | 自建网关时改为对应地址；留空走官方 |
| `OPENAI_MODEL_NAME` | ⛔ | 模型名，默认 `gpt-4o-mini` |
| `SERPER_API_KEY` | ✅ | 联网搜索 key，<https://serper.dev> 注册即得（免费层 2500 次/月） |

### 3. 运行

```bash
# 直接打印到终端
python main.py "马斯克"

# 同时落盘到 output/马斯克.md
python main.py "Sam Altman" --save
```

运行成功时，你会看到 Researcher 多次调用 `Search the internet` 工具，
最终控制台输出一份 5 段式 Markdown 简介。

---

## 常见问题

### 我想用国内代理 / 自建网关怎么办？

把 `.env` 改成：

```ini
OPENAI_API_KEY=sk-xxx
OPENAI_API_BASE=https://your-proxy.example.com/v1
OPENAI_MODEL_NAME=deepseek-chat   # 或其它兼容模型名
```

CrewAI 会自动使用这三个变量构造 LLM 客户端，无需改代码。

### 我想换搜索服务怎么办？

只改 `tools.py` 里的 `build_search_tool()`：例如换成

```python
from crewai_tools import WebsiteSearchTool
return WebsiteSearchTool(website="https://www.wikipedia.org")
```

或自实现一个继承自 `crewai.tools.BaseTool` 的工具类。
`agents.py` 中 `tools=[search_tool]` 会自动跟随。

### 我想同时跑多个人名？

在 `main.py` 里循环调用 `crew.kickoff(...)`，或把 `crew` 实例配合
`Process.hierarchical` + `manager_llm` 改造成并行/层级执行。

---

## 进阶扩展（不在本次实现范围）

- 引入 `ScrapeWebsiteTool`，抓取搜索结果里的具体文章原文，进一步提升事实深度
- 接 `output/agents_memory.db` 等持久化，让 Crew 跨次会话记住人名
- 用 `pytest` + `unittest.mock` mock 掉 `SerperDevTool`，不消耗真 key 也能验证装配
- 把人名输入换成 CSV / stdin，并发跑批

---

## 参考资料

- [CrewAI 官方文档](https://docs.crewai.com/)
- [SerperDevTool 文档](https://docs.crewai.com/en/tools/search-research/serperdevtool)
- [Serper.dev](https://serper.dev) — Google 搜索 API 注册