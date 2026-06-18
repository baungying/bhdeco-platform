"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteImage from "@/components/SiteImage";
import type { SiteImageKey } from "@/config/siteImages";

const categories=[
  {id:"c-channel",  label:"C Channel Frame",      icon:"🔩"},
  {id:"container",  label:"Container House",       icon:"📦"},
  {id:"hardware",   label:"Hardware Accessories",  icon:"🔧"},
  {id:"board",      label:"Boards & Panels",       icon:"🪵"},
  {id:"floor",      label:"Floor Material",        icon:"🟫"},
  {id:"wall",       label:"Wall & Ceiling",        icon:"🎨"},
  {id:"mobihome",   label:"Mobihome",              icon:"🏡"},
];

const products: {cat:string;name:string;desc:string;spec:string;material:string;imgKey:SiteImageKey}[]=[
  // C Channel Frame
  {cat:"c-channel",name:"C75 Wall Stud",         desc:"Standard C75 light gauge steel stud for interior partition walls.",                   spec:"75×45×0.6mm / 3m",          material:"Galvanised G550 Steel",         imgKey:"productSteel"},
  {cat:"c-channel",name:"C90 Heavy Stud",         desc:"Heavy-duty C90 stud for load-bearing partition and ceiling applications.",            spec:"90×45×0.8mm / 3m",          material:"Galvanised G550 Steel",         imgKey:"productSteel"},
  {cat:"c-channel",name:"Track & Omega Runner",   desc:"Floor and ceiling tracks plus omega runners for complete framing systems.",            spec:"Standard & custom lengths",   material:"Galvanised Steel",              imgKey:"productSteel"},
  // Container House
  {cat:"container", name:"20ft Standard Container",desc:"20ft modified shipping container with insulation, windows and interior finish.",      spec:"6.0×2.4×2.6m",              material:"Corten Steel / Rock Wool Panel",imgKey:"productContainer"},
  {cat:"container", name:"40ft Living Container",  desc:"40ft container converted to fully fitted living unit with kitchen and bathroom.",     spec:"12.0×2.4×2.6m",             material:"Corten Steel / SIP Panel",      imgKey:"productContainer"},
  {cat:"container", name:"Office Container Unit",  desc:"Double-stacked office container with electrical fit-out and AC provision.",           spec:"6.0×2.4×2.6m per unit",     material:"Corten Steel / Insulated Panel",imgKey:"productContainer"},
  // Hardware Accessories
  {cat:"hardware",  name:"Soft-Close Hinges",      desc:"Full-overlay concealed hinges with integrated soft-close damper for cabinets.",       spec:"35mm cup / 110° opening",    material:"Zinc Alloy",                    imgKey:"productPanels"},
  {cat:"hardware",  name:"Drawer Slide System",    desc:"Full-extension undermount drawer slides with push-to-open option.",                    spec:"300–600mm lengths",          material:"Cold-rolled Steel",             imgKey:"productPanels"},
  {cat:"hardware",  name:"Wardrobe Hardware Set",  desc:"Hanging rails, shelf supports, trouser racks and corner solutions for wardrobes.",     spec:"Standard & custom sets",     material:"Aluminium / Zinc Alloy",        imgKey:"productPanels"},
  // Furniture Board
  {cat:"board",     name:"Melamine MDF Board",     desc:"E1-grade MDF with melamine surface. Wide colour and texture range available.",         spec:"1220×2440mm / 15–18mm",     material:"MDF Core / Melamine Surface",   imgKey:"productFurniture"},
  {cat:"board",     name:"Moisture-Resistant MDF", desc:"Green-core MR-MDF for bathroom vanity, kitchen, and humid area applications.",         spec:"1220×2440mm / 12–18mm",     material:"MR-MDF Core / Melamine",        imgKey:"productFurniture"},
  {cat:"board",     name:"PVC Foam Board",          desc:"Lightweight PVC foam board for cabinet backing, ceiling panels and signage.",           spec:"1220×2440mm / 3–18mm",      material:"PVC Foam",                      imgKey:"productFurniture"},
  // Floor Material
  {cat:"floor",     name:"SPC Rigid Core Floor",   desc:"Stone plastic composite flooring — 100% waterproof, suitable for all areas.",          spec:"182×1220mm / 4–6mm",        material:"SPC Core / Wear Layer",         imgKey:"productWardrobe"},
  {cat:"floor",     name:"Laminate Floor 12mm",    desc:"AC4-rated laminate floor with synchronised emboss texture and click system.",           spec:"195×1285mm / 12mm",         material:"HDF Core / Melamine Surface",   imgKey:"productWardrobe"},
  {cat:"floor",     name:"Luxury Vinyl Tile",       desc:"LVT with realistic stone and wood visuals. Glue-down or click installation.",           spec:"457×457mm or plank format", material:"PVC / Fibreglass Core",         imgKey:"productWardrobe"},
  // Wall Material
  {cat:"wall",      name:"WPC Decorative Panel",   desc:"Wood plastic composite wall panel. Interior feature wall and partition cladding.",      spec:"150×10mm / custom length",  material:"WPC (Wood + PVC Composite)",    imgKey:"productPanels"},
  {cat:"wall",      name:"PVC Ceiling & Wall Panel",desc:"Moisture-proof PVC panel for ceilings, bathrooms, and commercial interiors.",          spec:"250×6000mm / 8mm",          material:"PVC with UV coating",           imgKey:"productPanels"},
  {cat:"wall",      name:"Gypsum Board 12.5mm",    desc:"Standard gypsum board for drylining, partition walls, and suspended ceilings.",         spec:"1200×2400mm / 12.5mm",      material:"Gypsum Core / Paper Face",      imgKey:"productPanels"},
  // Mobihome
  {cat:"mobihome",  name:"Mobihome Classic Unit",  desc:"Prefabricated modular home with full interior finish and utility connections.",         spec:"30–60 sqm options",          material:"SIP Panel / Light Steel Frame", imgKey:"productMobihome"},
  {cat:"mobihome",  name:"Tiny House Prefab",       desc:"Compact single-level prefab unit designed for urban infill and holiday use.",           spec:"25–40 sqm",                 material:"SIP / Timber Frame Hybrid",     imgKey:"productMobihome"},
  {cat:"mobihome",  name:"Custom Modular Design",  desc:"Multi-module configurations designed to specification. Studio to 4-bedroom.",           spec:"Custom — from 40 sqm",       material:"SIP / Steel / Timber options",  imgKey:"productMobihome"},
];

export default function Products() {
  return (
    <div style={{background:"#010408",color:"#EDE8DC",minHeight:"100vh"}}>
      <Navbar/>

      {/* Hero */}
      <SiteImage imageKey="productsHero" asBackground style={{
        padding:"9rem 2rem 5rem",textAlign:"center",position:"relative",
        minHeight:"55vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      }}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(1,4,8,.92) 0%,rgba(1,4,8,.82) 50%,rgba(1,4,8,.96) 100%)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <p style={{fontFamily:"monospace",fontSize:".6rem",color:"#D4A73D",letterSpacing:".22em",marginBottom:"1rem"}}>BLESSING HOME PRODUCTS</p>
          <h1 className="fd" style={{fontSize:"clamp(2.5rem,6vw,4.5rem)",fontWeight:"300",marginBottom:"1.25rem"}}>Premium <span style={{fontStyle:"italic",color:"#D4A73D"}}>Products</span></h1>
          <p style={{color:"#7A8FA8",maxWidth:"520px",margin:"0 auto",lineHeight:"1.9"}}>From light steel framing and container houses to premium boards, wall systems and modular homes — discover products engineered for modern construction.</p>
        </div>
      </SiteImage>

      {/* Filter tabs */}
      <div style={{padding:"1.75rem",background:"rgba(1,4,8,.95)",borderBottom:"1px solid rgba(255,255,255,.06)",position:"sticky",top:"64px",zIndex:100,backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:"1280px",margin:"0 auto",display:"flex",gap:".5rem",flexWrap:"wrap",justifyContent:"center"}}>
          {categories.map(c=>(
            <a key={c.id} href={`#${c.id}`} style={{display:"flex",alignItems:"center",gap:".4rem",padding:".4rem 1rem",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"100px",textDecoration:"none",color:"#7A8FA8",fontSize:".76rem",transition:"all .2s"}}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="#D4A73D44";el.style.color="#D4A73D";}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,.08)";el.style.color="#7A8FA8";}}>
              <span>{c.icon}</span><span>{c.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Products by category */}
      <section style={{padding:"5rem 2rem 7rem",background:"#010408"}}>
        <div style={{maxWidth:"1280px",margin:"0 auto"}}>
          {categories.map(cat=>{
            const list=products.filter(p=>p.cat===cat.id);
            if(!list.length) return null;
            return(
              <div key={cat.id} id={cat.id} style={{marginBottom:"5rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2rem"}}>
                  <span style={{fontSize:"1.5rem"}}>{cat.icon}</span>
                  <h2 className="fd" style={{fontSize:"clamp(1.8rem,3.5vw,2.5rem)",fontWeight:"300"}}>{cat.label}</h2>
                  <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,rgba(212,167,61,.3),transparent)"}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1.25rem"}}>
                  {list.map(p=>(
                    <div key={p.name} style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"14px",overflow:"hidden",transition:"all .3s"}}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(212,167,61,.22)";el.style.transform="translateY(-4px)";el.style.boxShadow="0 20px 60px rgba(0,0,0,.4)";}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,.07)";el.style.transform="none";el.style.boxShadow="none";}}>
                      <SiteImage imageKey={p.imgKey} asBackground style={{height:"180px",position:"relative",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(1,4,8,.6) 0%,transparent 60%)"}}/>
                      </SiteImage>
                      <div style={{padding:"1.5rem"}}>
                        <h3 style={{fontSize:"1rem",fontWeight:"600",marginBottom:".5rem"}}>{p.name}</h3>
                        <p style={{color:"#7A8FA8",fontSize:".82rem",lineHeight:"1.65",marginBottom:"1rem"}}>{p.desc}</p>
                        <div style={{display:"flex",flexDirection:"column",gap:".4rem",marginBottom:"1.25rem"}}>
                          <div style={{display:"flex",gap:".6rem"}}><span style={{fontFamily:"monospace",fontSize:".6rem",color:"#2E4060",width:"65px",flexShrink:0}}>SIZE</span><span style={{fontSize:".8rem",color:"#EDE8DC"}}>{p.spec}</span></div>
                          <div style={{display:"flex",gap:".6rem"}}><span style={{fontFamily:"monospace",fontSize:".6rem",color:"#2E4060",width:"65px",flexShrink:0}}>MATERIAL</span><span style={{fontSize:".8rem",color:"#EDE8DC"}}>{p.material}</span></div>
                        </div>
                        <a href="mailto:support@bhdeco.ai?subject=Product Inquiry" className="btn-outline" style={{width:"100%",justifyContent:"center",fontSize:".72rem",padding:".7rem 1rem"}}>GET QUOTE →</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer/>
    </div>
  );
}
