import subprocess
import json

topics = [
    "portfolio",
    "personal-website",
    "ai-developer",
    "full-stack",
    "vanilla-javascript",
    "dark-theme",
    "vercel",
    "resend",
    "seo",
    "responsive-design",
    "single-page",
    "serverless",
    "artificial-intelligence",
    "generative-ai",
    "llm",
    "langchain",
    "mcp",
    "open-source",
    "developer-portfolio",
    "web-development"
]

description = "Dark, lime-accented one-page portfolio of Bharani Kumar S — an AI full-stack developer. Smooth-scrolling vanilla JS, SEO-ready, Resend contact form, deployed on Vercel."

def update_metadata():
    # Update description
    subprocess.run(["gh", "repo", "edit", "vincenzo-afk/PORTFOLIO", "--description", description], check=True)
    
    # Update topics
    # gh repo edit --add-topic is cumulative, but we want to set the full list.
    # The CLI doesn't have a direct 'set-topics', so we use the API.
    
    api_cmd = [
        "gh", "api",
        "-X", "PUT",
        "-H", "Accept: application/vnd.github+json",
        "-H", "X-GitHub-Api-Version: 2022-11-28",
        "/repos/vincenzo-afk/PORTFOLIO/topics",
        "-f", f"names={json.dumps(topics)}"
    ]
    subprocess.run(api_cmd, check=True)
    print("Metadata updated successfully.")

if __name__ == "__main__":
    update_metadata()
