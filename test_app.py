from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.on("console", lambda msg: print(f"CONSOLE: [{msg.type}] {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGEERROR: {exc}"))
    page.on("requestfailed", lambda req: print(f"FAILED: {req.url} {req.failure}"))
    
    print("Navigating...")
    page.goto("http://localhost:5173")
    page.wait_for_timeout(3000)
    print("Done waiting.")
    print("ROOT INNERHTML:")
    print(page.evaluate("document.getElementById('root').innerHTML"))
    browser.close()
