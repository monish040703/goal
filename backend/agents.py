import os
import json
from typing import TypedDict, List, Annotated
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, SystemMessage

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

def get_llm():
    if GOOGLE_API_KEY:
        return ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=GOOGLE_API_KEY,
            temperature=0.7
        )
    return None

# ─── Weekly Summary Agent ─────────────────────────────────────────────────────

class SummaryState(TypedDict):
    tasks: List[dict]
    businesses: List[dict]
    raw_summary: str
    insights: List[str]
    recommendations: List[str]
    done: bool

def analyze_tasks(state: SummaryState) -> SummaryState:
    llm = get_llm()
    tasks = state["tasks"]
    businesses = state["businesses"]
    
    tasks_text = "\n".join([
        f"- Task: '{t['title']}' | Completion: {t['completion_percentage']}% | Subtasks: {len(t.get('subtasks', []))}"
        for t in tasks
    ]) or "No tasks this week."
    
    biz_text = "\n".join([
        f"- Business: '{b['title']}' ({b.get('industry','')}) | Goal completion: {b['completion_percentage']}%"
        for b in businesses
    ]) or "No business goals this week."

    if llm:
        messages = [
            SystemMessage(content="""You are GoalFlow AI, an expert productivity and business coach.
            Analyze the user's weekly performance and provide:
            1. A warm, motivating summary paragraph (2-3 sentences)
            2. 3 specific insights about their progress
            3. 3 actionable recommendations for next week
            
            Respond ONLY in this exact JSON format:
            {
                "summary": "...",
                "insights": ["...", "...", "..."],
                "recommendations": ["...", "...", "..."]
            }"""),
            HumanMessage(content=f"Weekly Tasks:\n{tasks_text}\n\nBusiness Goals:\n{biz_text}")
        ]
        try:
            response = llm.invoke(messages)
            text = response.content.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            data = json.loads(text)
            state["raw_summary"] = data.get("summary", "")
            state["insights"] = data.get("insights", [])
            state["recommendations"] = data.get("recommendations", [])
        except Exception as e:
            state["raw_summary"] = f"You completed {sum(t['completion_percentage'] for t in tasks)//max(len(tasks),1)}% of your tasks on average this week. Keep pushing forward!"
            state["insights"] = [
                f"You tracked {len(tasks)} task groups this week",
                f"Your business goals show {len(businesses)} active ventures",
                "Consistency is key to long-term success"
            ]
            state["recommendations"] = [
                "Break down large tasks into smaller subtasks for better tracking",
                "Set specific due dates to stay accountable",
                "Review and update your business goals weekly"
            ]
    else:
        total_tasks = len(tasks)
        avg_completion = sum(t['completion_percentage'] for t in tasks) // max(total_tasks, 1)
        state["raw_summary"] = f"This week you managed {total_tasks} task groups with an average completion of {avg_completion}%. You also tracked {len(businesses)} business ventures. Stay focused and keep building!"
        state["insights"] = [
            f"Tracked {total_tasks} task groups with {avg_completion}% average completion",
            f"Active business goals: {len(businesses)} ventures in progress",
            "Your discipline in tracking goals sets you apart"
        ]
        state["recommendations"] = [
            "Focus on completing your highest-priority subtasks first",
            "Allocate dedicated time blocks for business strategy",
            "Celebrate small wins to maintain motivation"
        ]
    
    state["done"] = True
    return state

def build_summary_graph():
    graph = StateGraph(SummaryState)
    graph.add_node("analyze", analyze_tasks)
    graph.set_entry_point("analyze")
    graph.add_edge("analyze", END)
    return graph.compile()

summary_graph = build_summary_graph()

# ─── Theme Agent ─────────────────────────────────────────────────────────────

THEMES = {
    "dark-purple": {"primary": "#6366f1", "secondary": "#8b5cf6", "accent": "#a78bfa", "background": "#0f0a1e"},
    "dark-cyan": {"primary": "#06b6d4", "secondary": "#0891b2", "accent": "#67e8f9", "background": "#0a1929"},
    "dark-green": {"primary": "#10b981", "secondary": "#059669", "accent": "#6ee7b7", "background": "#0a1f1a"},
    "dark-rose": {"primary": "#f43f5e", "secondary": "#e11d48", "accent": "#fda4af", "background": "#1a0a0f"},
    "dark-amber": {"primary": "#f59e0b", "secondary": "#d97706", "accent": "#fcd34d", "background": "#1a1200"},
    "dark-blue": {"primary": "#3b82f6", "secondary": "#2563eb", "accent": "#93c5fd", "background": "#0a0f1e"},
    "midnight": {"primary": "#a855f7", "secondary": "#9333ea", "accent": "#d8b4fe", "background": "#030712"},
    "neon-city": {"primary": "#ec4899", "secondary": "#f97316", "accent": "#facc15", "background": "#0a0a0a"},
}

class ThemeState(TypedDict):
    preference: str
    theme_name: str
    colors: dict
    message: str
    done: bool

def select_theme(state: ThemeState) -> ThemeState:
    preference = state["preference"].lower()
    llm = get_llm()
    
    theme_list = "\n".join([f"- {name}: primary={v['primary']}" for name, v in THEMES.items()])
    
    if llm:
        messages = [
            SystemMessage(content=f"""You are a UI/UX design AI. Based on the user's preference, 
            select the best theme from this list and explain why in one sentence.
            
            Available themes:
            {theme_list}
            
            Respond ONLY in JSON:
            {{"theme": "theme-name", "message": "Why this theme suits you..."}}"""),
            HumanMessage(content=f"User wants: {preference}")
        ]
        try:
            response = llm.invoke(messages)
            text = response.content.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            data = json.loads(text)
            theme_name = data.get("theme", "dark-purple")
            if theme_name not in THEMES:
                theme_name = "dark-purple"
            state["theme_name"] = theme_name
            state["colors"] = THEMES[theme_name]
            state["message"] = data.get("message", "Theme applied!")
        except:
            state["theme_name"] = "dark-purple"
            state["colors"] = THEMES["dark-purple"]
            state["message"] = "Applied the default purple theme."
    else:
        # Simple keyword matching
        chosen = "dark-purple"
        if any(w in preference for w in ["calm", "ocean", "water", "blue", "cool"]):
            chosen = "dark-cyan"
        elif any(w in preference for w in ["nature", "growth", "green", "fresh"]):
            chosen = "dark-green"
        elif any(w in preference for w in ["passion", "love", "pink", "rose", "red"]):
            chosen = "dark-rose"
        elif any(w in preference for w in ["energy", "warm", "orange", "amber", "gold"]):
            chosen = "dark-amber"
        elif any(w in preference for w in ["professional", "corporate", "trust"]):
            chosen = "dark-blue"
        elif any(w in preference for w in ["dark", "midnight", "mystery", "luxury"]):
            chosen = "midnight"
        elif any(w in preference for w in ["neon", "cyberpunk", "vibrant", "electric"]):
            chosen = "neon-city"
        
        state["theme_name"] = chosen
        state["colors"] = THEMES[chosen]
        state["message"] = f"Applied {chosen} theme based on your preference!"
    
    state["done"] = True
    return state

def build_theme_graph():
    graph = StateGraph(ThemeState)
    graph.add_node("select", select_theme)
    graph.set_entry_point("select")
    graph.add_edge("select", END)
    return graph.compile()

theme_graph = build_theme_graph()
