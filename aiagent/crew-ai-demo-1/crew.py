"""Crew 组装：串联 researcher + writer 两个 Agent。

采用 `Process.sequential`：先跑 research_task，再把结果交给 writing_task。
"""

from __future__ import annotations

from crewai import Crew, Process

from agents import researcher, writer
from tasks import research_task, writing_task


crew: Crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,
    verbose=True,
)