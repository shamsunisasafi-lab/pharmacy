import { useState, useMemo, useEffect } from "react";
import "./PharmacyPlace.css";

const PHARMACIES = ["Carry Medical", "Pool Medical", "OK Pharmacy", "Hamza Pharma", "Caring Pharmacy", "Hilton Medical"];


const CATEGORIES = [
  { id: "antibiotic", title: "Antibiotics", color: "#6b2fa0", items: [
    ["Amoxil 500", "Amoxicillin", 8, "Bacterial infections of the ear, throat, chest and urinary tract.", "Do not use if allergic to penicillin. Finish the full course."],
    ["Zithro 250", "Azithromycin", 12, "Respiratory, skin and some sexually transmitted bacterial infections.", "May cause stomach upset. Tell your doctor about heart rhythm problems."],
    ["Cipro 500", "Ciprofloxacin", 10, "Urinary tract, bone, joint and some stomach infections.", "Can affect tendons. Avoid in children unless prescribed."],
    ["Augmentin 625", "Amoxicillin + Clavulanate", 15, "Sinus, chest, skin and dental infections that need stronger cover.", "Take with food. Do not use if allergic to penicillin."]] },
  { id: "hypertension", title: "High Blood Pressure", color: "#1e6fb8", items: [
    ["Norvasc 5", "Amlodipine", 9, "Lowers high blood pressure and helps prevent chest pain (angina).", "May cause ankle swelling or dizziness. Do not stop suddenly."],
    ["Cozaar 50", "Losartan", 11, "High blood pressure and kidney protection in diabetes.", "Not for use in pregnancy. Check potassium levels regularly."],
    ["Tenormin 50", "Atenolol", 7, "High blood pressure, angina and irregular heartbeat.", "Do not stop suddenly. Use with care in asthma."],
    ["Zestril 10", "Lisinopril", 8, "High blood pressure and heart failure.", "May cause a dry cough. Not for use in pregnancy."]] },
  { id: "hypotension", title: "Low Blood Pressure", color: "#0f8b8d", items: [
    ["Florinef 0.1", "Fludrocortisone", 14, "Low blood pressure caused by fluid and salt loss; adrenal insufficiency.", "May raise potassium loss and swelling. Needs doctor monitoring."],
    ["ProAmatine 5", "Midodrine", 18, "Low blood pressure when standing up (orthostatic hypotension).", "Can raise blood pressure when lying down. Take during the day."],
    ["Northera 100", "Droxidopa", 30, "Dizziness and fainting caused by low blood pressure on standing.", "Prescription only. Avoid lying flat for long periods after a dose."]] },
  { id: "pain", title: "Pain Relief", color: "#c2410c", items: [
    ["Panadol 500", "Paracetamol", 4, "Mild to moderate pain and fever.", "Never exceed the daily limit on the label. Avoid extra paracetamol products."],
    ["Brufen 400", "Ibuprofen", 6, "Pain, inflammation and fever (headache, toothache, joint pain).", "Take with food. Avoid with stomach ulcers or kidney problems."],
    ["Voltaren 50", "Diclofenac", 7, "Joint, muscle and back pain; arthritis.", "May irritate the stomach. Use the lowest dose for the shortest time."],
    ["Ponstan 500", "Mefenamic Acid", 8, "Period pain, toothache and mild to moderate pain.", "Take with food. Stop if you get a rash or severe stomach pain."]] },
  { id: "stomach", title: "Stomach", color: "#6b2fa0", items: [
    ["Esso 40", "Esomeprazole", 10, "Acid reflux, heartburn and stomach ulcers.", "Take before meals. Long-term use should be reviewed by a doctor. ", "/images/esoomeprazol.webp"],
    ["Losec 20", "Omeprazole", 9, "Heartburn, acid reflux and ulcer prevention.", "Take in the morning before food. Not for long-term use without advice."],
    ["Zantac 150", "Ranitidine", 6, "Excess stomach acid and indigestion.", "Ask your pharmacist about availability and alternatives in your area."],
    ["Gaviscon", "Alginate + Antacid", 12, "Quick relief from heartburn and acid indigestion.", "Contains sodium. Take after meals and at bedtime."]] },
  { id: "women", title: "Women & Maternity", color: "#be185d", items: [
    ["Folic Acid 5", "Folic Acid", 5, "Helps prevent birth defects before and during early pregnancy; anaemia.", "Follow your doctor's advice on the correct strength."],
    ["Obimin", "Prenatal Vitamins", 22, "Daily vitamin and mineral support during pregnancy and breastfeeding.", "Keep away from children. Iron can cause constipation."],
    ["Duphaston 10", "Dydrogesterone", 28, "Irregular periods, endometriosis and support in some pregnancy conditions.", "Prescription only. Use exactly as directed."],
    ["Ferrous Fumarate", "Iron", 9, "Iron deficiency and anaemia, including during pregnancy.", "May darken stools. Keep out of reach of children."]] },
  { id: "children", title: "Children", color: "#15803d", items: [
    ["Calpol Syrup", "Paracetamol 120mg/5ml", 7, "Fever and mild pain in children.", "Dose by age and weight. Use only the measuring syringe provided."],
    ["Zyrtec Drops", "Cetirizine", 11, "Allergies, hay fever and itchy skin in children.", "May cause drowsiness. Check the minimum age on the label."],
    ["ORS Sachet", "Oral Rehydration Salts", 3, "Replaces fluids and salts lost during diarrhoea and vomiting.", "Mix only with the stated amount of clean water. Seek help if no improvement."],
    ["Vitamin D Drops", "Cholecalciferol", 13, "Supports strong bones and teeth in babies and children.", "Do not exceed the recommended drops per day."]] },
].map((c) => ({
  ...c,
  items: c.items.map(([name, generic, price, use, warn ,img], i) => ({
    id: `${c.id}-${i}`, name, generic, price, use, warn, category: c.title, color: c.color,
    pharmacy: PHARMACIES[(i + c.id.length) % PHARMACIES.length],
    image: img || `/images/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}.jpg`,
  })),
}));

const NAV = ["Dashboard", "Appointments", "Find Doctor", "Find Clinic", "Chat", "Find MarketPlace", "Find Pharmacy", "My Dependents", "My Account", "Settings"];

function Pic({ item }) {
  const [bad, setBad] = useState(false);
  if (!bad) return <img className="pp-photo" src={item.image} alt={item.name} onError={() => setBad(true)} />;
  return (
    <div className="pp-box" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)` }}>
      <em>1X14 Capsules</em>
      <strong>{item.name}</strong>
      <em>({item.generic})</em>
    </div>
  );
}

function Card({ item, onBuy, onOpen }) {
  return (
    <div className="pp-card">
      <div className="pp-img" onClick={() => onOpen(item)} title="Click for details">
        <Pic item={item} />
      </div>
      <div className="pp-row"><span>{item.generic}</span><b>{item.price} RM</b></div>
      <div className="pp-ph"><s>{item.pharmacy[0]}</s>{item.pharmacy}</div>
      <p className="pp-desc">High quality medicine, fresh stock and trusted service.</p>
      <button className="pp-buy" onClick={() => onBuy(item)}>BUY NOW</button>
    </div>
  );
}

function Details({ item, onClose, onBuy }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="pp-overlay" onClick={onClose}>
      <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pp-x" onClick={onClose} aria-label="Close">×</button>
        <div className="pp-modal-img"><Pic item={item} /></div>
        <div className="pp-modal-body">
          <span className="pp-tag">{item.category}</span>
          <h3>{item.name}</h3>
          <p className="pp-gen">{item.generic}</p>
          <p className="pp-price">{item.price} RM <small>· sold by {item.pharmacy}</small></p>
          <h4>Used for</h4>
          <p>{item.use}</p>
          <h4>Warnings</h4>
          <p>{item.warn}</p>
          <p className="pp-note">This information is general. Always follow your doctor's or pharmacist's advice and the product label.</p>
          <button className="pp-buy" style={{ marginLeft: 0 }} onClick={() => { onBuy(item); onClose(); }}>BUY NOW</button>
        </div>
      </div>
    </div>
  );
}

export default function PharmacyPlace() {
  const [open, setOpen] = useState(true);
  const [global, setGlobal] = useState("");
  const [local, setLocal] = useState({});
  const [toast, setToast] = useState("");
  const [selected, setSelected] = useState(null);

  const match = (it, q) => {
    q = q.trim().toLowerCase();
    return !q || [it.name, it.generic, it.pharmacy].some((s) => s.toLowerCase().includes(q));
  };

  const sections = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        ...c,
        shown: c.items.filter((it) => match(it, global) && match(it, local[c.id] || "")),
      })).filter((c) => !global.trim() || c.shown.length),
    [global, local]
  );

  const buy = (it) => {
    setToast(`${it.name} added - ${it.pharmacy}`);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="pp">
      <aside className={`pp-side ${open ? "" : "hide"}`}>
        <div className="pp-logo"><b>Pi</b>MyPatientHUB</div>
        {NAV.map((n) => (
          <button key={n} className={`pp-nav ${n === "Find Pharmacy" ? "on" : ""}`}>
            <i>{n[0]}</i>{n}
          </button>
        ))}
      </aside>

      <main className="pp-main">
        <header className="pp-top">
          <div className="pp-crumb">
            <small>⌂ / Pharmacyplace</small>
            <h1>Pharmacyplace</h1>
          </div>
          <button className="pp-burger" aria-label="Toggle sidebar" onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
          <div className="pp-spacer" />
          <input className="pp-input" style={{ width: 220 }} placeholder="Type here..." value={global} onChange={(e) => setGlobal(e.target.value)} />
          <span className="pp-user">◉ Log out</span>
        </header>

        {sections.map((c) => (
          <section className="pp-sec" key={c.id}>
            <div className="pp-sechead">
              <h2>{c.title}</h2>
              <input className="pp-input" style={{ width: 200 }} placeholder="Search..." value={local[c.id] || ""} onChange={(e) => setLocal({ ...local, [c.id]: e.target.value })} />
            </div>
            {c.shown.length ? (
              <div className="pp-grid">
                {c.shown.map((it) => <Card key={it.id} item={it} onBuy={buy} onOpen={setSelected} />)}
              </div>
            ) : (
              <div className="pp-empty">No medicine found.</div>
            )}
          </section>
        ))}
        {!sections.length && <div className="pp-sec pp-empty">No medicine found.</div>}
        <p style={{ color: "#67748e", fontSize: 13, margin: "20px 4px" }}>© 2026, made with ♥ by MyPiHUB</p>
      </main>

      {selected && <Details item={selected} onClose={() => setSelected(null)} onBuy={buy} />}
      {toast && <div className="pp-toast">{toast}</div>}
    </div>
  );
}
