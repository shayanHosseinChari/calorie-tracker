from torob_integration.api import Torob

def get_torob_offers():
    torob = Torob()
    
   
    try:
        results = torob.search("گوشی موبایل", page=0)
        
        print(f"\n--- نتایج دریافت شده از ترب ---\n")
        for idx, item in enumerate(results[:15], 1):
            name = item.get("name1") or item.get("title", "بدون نام")
            price = item.get("price_text", "نامشخص")
            prk = item.get("web_client_prk")
            link = f"https://torob.com/p/{prk}/" if prk else "لینک نامشخص"
            
            print(f"{idx}. {name}")
            print(f"   قیمت: {price}")
            print(f"   لینک: {link}")
            print("-" * 50)
            
    except Exception as e:
        print(f"[!] خطا در ارتباط با ترب: {e}")

if __name__ == "__main__":
    get_tor_offers = get_torob_offers
    get_tor_offers()
