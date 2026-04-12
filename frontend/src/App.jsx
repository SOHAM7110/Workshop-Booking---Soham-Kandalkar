import { useState } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const WORKSHOP_TYPES = [
  { id: 1,name: "Python for Scientific Computing", duration: 2, description: "An introductory workshop covering Python fundamentals for scientific applications including NumPy, SciPy, and Matplotlib.", terms_and_conditions: "Participants must bring their own laptops. Internet connection required. Basic programming knowledge preferred." },
  { id: 2, name: "Scilab Fundamentals", duration: 1, description: "Hands-on workshop on Scilab, the open-source alternative to MATLAB, covering basic to intermediate features.", terms_and_conditions: "Scilab must be pre-installed before the workshop. Coordinator must ensure lab facilities." },
  { id: 3, name: "Data Analysis with Pandas", duration: 1, description: "Workshop covering data manipulation and analysis using the Pandas library in Python.", terms_and_conditions: "Python and Pandas must be installed. Participants should have basic Python knowledge." },
  { id: 4, name: "Introduction to OpenFOAM", duration: 3, description: "A multi-day workshop on the open-source CFD toolbox OpenFOAM for fluid dynamics simulations.", terms_and_conditions: "Linux environment required. Participants must complete pre-workshop reading material." },
  { id: 5, name: "Basic Linux and Shell Scripting", duration: 1, description: "Workshop covering essential Linux commands and shell scripting for scientific computing workflows.", terms_and_conditions: "Linux or macOS preferred. Windows users must have WSL installed." },
];

const WORKSHOPS = [
  { id: 1, workshop_type: "Python for Scientific Computing", workshop_type_id: 1, date: "2026-05-15", coordinator: "Anjali Sharma", coordinator_id: 10, instructor: "Dr. Ramesh Kumar", status: true, tnc_accepted: true, comments: [{ id: 1, author: "Dr. Ramesh Kumar", author_id: 5, comment: "Please ensure all laptops have Anaconda installed before the session.", public: true, created_date: "2026-04-01" }] },
  { id: 2, workshop_type: "Scilab Fundamentals", workshop_type_id: 2, date: "2026-06-10", coordinator: "Self", coordinator_id: 1, instructor: null, status: false, tnc_accepted: true, comments: [] },
  { id: 3, workshop_type: "Data Analysis with Pandas", workshop_type_id: 3, date: "2026-04-28", coordinator: "Dr. Mehta", coordinator_id: 11, instructor: "Prof. Sunita Rao", status: true, tnc_accepted: true, comments: [{ id: 2, author: "Prof. Sunita Rao", author_id: 6, comment: "Dataset files will be shared 2 days before.", public: true, created_date: "2026-04-10" }] },
];

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry"];

// ─── Design tokens (inline style constants) ──────────────────────────────────
const C = {
  navy:    "#0f2044",
  blue:    "#1a56db",
  teal:    "#0694a2",
  indigo:  "#5145cd",
  amber:   "#d97706",
  green:   "#057a55",
  red:     "#e02424",
  slate:   "#f1f5f9",
  border:  "#e2e8f0",
};

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const Badge = ({ status }) => (
  <span style={{
    background: status ? "#d1fae5" : "#fef3c7",
    color:      status ? "#065f46" : "#92400e",
    border:     `1px solid ${status ? "#6ee7b7" : "#fcd34d"}`,
    fontSize: "11px", fontWeight: 700, padding: "2px 10px",
    borderRadius: 999, letterSpacing: "0.03em",
  }}>
    {status ? "✓ Accepted" : "⏳ Pending"}
  </span>
);

// Coloured page header banner
const PageHeader = ({ title, subtitle, color = C.navy }) => (
  <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, borderRadius: 12, padding: "22px 28px", marginBottom: 24 }}>
    <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h2>
    {subtitle && <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: "4px 0 0" }}>{subtitle}</p>}
  </div>
);

// Section sub-heading with left colour bar
const SectionHeading = ({ children, color = C.teal }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
    <div style={{ width: 4, height: 22, borderRadius: 4, background: color }} />
    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color }}>{children}</h3>
  </div>
);

// Styled table with coloured header
const StyledTable = ({ headers, rows, emptyMsg, accentColor = C.navy }) => (
  <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: accentColor }}>
          {headers.map(h => (
            <th key={h} style={{ padding: "10px 16px", color: "#fff", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <tr><td colSpan={headers.length} style={{ padding: "20px 16px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>{emptyMsg}</td></tr>
          : rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : C.slate, borderTop: `1px solid ${C.border}` }}
              onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : C.slate}>
              {row}
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

const Td = ({ children, style = {} }) => (
  <td style={{ padding: "10px 16px", color: "#334155", verticalAlign: "middle", ...style }}>{children}</td>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", style = {} }) => {
  const variants = {
    primary:   { background: C.blue,   color: "#fff", border: "none" },
    success:   { background: C.green,  color: "#fff", border: "none" },
    danger:    { background: C.red,    color: "#fff", border: "none" },
    outline:   { background: "transparent", color: C.blue, border: `1.5px solid ${C.blue}` },
    outlineGray: { background: "transparent", color: "#64748b", border: "1.5px solid #cbd5e1" },
    teal:      { background: C.teal,   color: "#fff", border: "none" },
  };
  const sizes = {
    sm: { fontSize: 12, padding: "4px 12px" },
    md: { fontSize: 13, padding: "7px 18px" },
    lg: { fontSize: 14, padding: "9px 24px" },
  };
  return (
    <button onClick={onClick} style={{ ...variants[variant], ...sizes[size], borderRadius: 7, fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s, transform 0.1s", ...style }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "translateY(0)"; }}>
      {children}
    </button>
  );
};

const InputField = ({ label, required, error, children }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>}
    {children}
    {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: C.red }}>{error}</p>}
  </div>
);

const inputStyle = { width: "100%", border: `1.5px solid #cbd5e1`, borderRadius: 7, padding: "8px 12px", fontSize: 13, color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" };

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = ({ user, page, setPage, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const isInstructor = user?.role === "instructor";

  return (
    <nav style={{ background: C.navy, position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>

        {/* Brand */}
        <button onClick={() => setPage("workshop_types")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #1a56db, #0694a2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "0.3px" }}>FOSSEE Workshops</span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden-mobile">
          {[
            { label: "Home", key: "workshop_types" },
            { label: "Statistics", key: "statistics" },
            ...(user ? [
              ...(isInstructor ? [{ label: "Team Stats", key: "team_stats" }] : []),
              { label: "Workshop Status", key: "workshop_status" },
              ...(!isInstructor ? [{ label: "Propose Workshop", key: "propose" }] : []),
              { label: "Workshop Types", key: "workshop_types_nav" },
            ] : [])
          ].map(item => (
            <button key={item.key} onClick={() => setPage(item.key === "workshop_types_nav" ? "workshop_types" : item.key)}
              style={{ background: page === item.key ? "rgba(255,255,255,0.15)" : "transparent", border: "none", color: page === item.key ? "#fff" : "rgba(255,255,255,0.72)", padding: "6px 13px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = page === item.key ? "rgba(255,255,255,0.15)" : "transparent"}>
              {item.label}
            </button>
          ))}

          {user ? (
            <div style={{ position: "relative", marginLeft: 8 }}>
              <button onClick={() => setDropOpen(o => !o)}
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 14px 5px 8px", display: "flex", alignItems: "center", gap: 7, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#1a56db,#0694a2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                  {user.name[0].toUpperCase()}
                </div>
                {user.name.split(" ")[0]} ▾
              </button>
              {dropOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", border: `1px solid ${C.border}`, minWidth: 170, zIndex: 100 }} onMouseLeave={() => setDropOpen(false)}>
                  <div style={{ padding: "10px 16px 8px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{user.role}</div>
                  </div>
                  {[["👤 Profile", "profile"], ["🔒 Change Password", "change_password"]].map(([label, key]) => (
                    <button key={key} onClick={() => { setPage(key); setDropOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 16px", fontSize: 13, color: "#334155", background: "none", border: "none", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.slate}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      {label}
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${C.border}` }}>
                    <button onClick={() => { onLogout(); setDropOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 16px", fontSize: 13, color: C.red, background: "none", border: "none", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fff1f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
              <Btn onClick={() => setPage("login")} variant="outline" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>Sign In</Btn>
              <Btn onClick={() => setPage("register")} variant="teal">Register</Btn>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(o => !o)} style={{ display: "none", background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }} className="show-mobile">☰</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#0d1b38", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "8px 16px 12px" }}>
          {[
            { label: "Home", key: "workshop_types" },
            { label: "Statistics", key: "statistics" },
            ...(user ? [
              ...(isInstructor ? [{ label: "Team Stats", key: "team_stats" }] : []),
              { label: "Workshop Status", key: "workshop_status" },
              ...(!isInstructor ? [{ label: "Propose Workshop", key: "propose" }] : []),
              { label: "Profile", key: "profile" },
            ] : [
              { label: "Sign In", key: "login" },
              { label: "Register", key: "register" },
            ])
          ].map(item => (
            <button key={item.key} onClick={() => { setPage(item.key); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", color: "rgba(255,255,255,0.85)", padding: "9px 4px", fontSize: 14, background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {item.label}
            </button>
          ))}
          {user && <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", color: "#f87171", padding: "9px 4px", fontSize: 14, background: "none", border: "none", cursor: "pointer", marginTop: 4 }}>Logout</button>}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </nav>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer style={{ background: C.navy, color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center", padding: "16px 20px", marginTop: 32 }}>
    Developed by <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>FOSSEE group, IIT Bombay</span>
  </footer>
);

// ─── Page wrapper ─────────────────────────────────────────────────────────────
const Page = ({ children }) => (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>{children}</div>
);

// ─── Workshop Type List ───────────────────────────────────────────────────────

const WorkshopTypeListPage = ({ user, setPage, setSelectedWorkshopType }) => {
  const isInstructor = user?.role === "instructor";
  return (
    <Page>
      <PageHeader title="Workshop Types" subtitle="Browse available FOSSEE workshops and view details" color={C.navy} />
      {isInstructor && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <Btn onClick={() => setPage("add_workshop_type")} variant="primary">+ Add Workshop Type</Btn>
        </div>
      )}
      <StyledTable
        accentColor={C.navy}
        headers={["Sr No", "Workshop Name", "Duration (Days)", "Action"]}
        emptyMsg="No workshop types found."
        rows={WORKSHOP_TYPES.map((w, i) => [
          <Td key="sr"><span style={{ background: "#e0e7ff", color: C.indigo, borderRadius: 6, padding: "2px 9px", fontWeight: 700, fontSize: 12 }}>{i + 1}</span></Td>,
          <Td key="name" style={{ fontWeight: 600, color: C.navy }}>{w.name}</Td>,
          <Td key="dur"><span style={{ background: "#f0fdf4", color: C.green, border: "1px solid #bbf7d0", borderRadius: 6, padding: "2px 9px", fontWeight: 600, fontSize: 12 }}>{w.duration} day{w.duration > 1 ? "s" : ""}</span></Td>,
          <Td key="act">
            <Btn variant="outline" size="sm" onClick={() => { setSelectedWorkshopType(w.id); setPage("workshop_type_details"); }}>
              View Details →
            </Btn>
          </Td>,
        ])}
      />
    </Page>
  );
};

// ─── Workshop Type Details ────────────────────────────────────────────────────

const WorkshopTypeDetailsPage = ({ workshopTypeId }) => {
  const wt = WORKSHOP_TYPES.find(w => w.id === workshopTypeId) || WORKSHOP_TYPES[0];
  const rows = [
    ["Workshop Name", wt.name, C.blue],
    ["Duration", `${wt.duration} day(s)`, C.teal],
    ["Description", wt.description, C.indigo],
    ["Terms & Conditions", wt.terms_and_conditions, C.amber],
  ];
  return (
    <Page>
      <PageHeader title="Workshop Details" color={C.indigo} />
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {rows.map(([label, value, color]) => (
          <div key={label} style={{ display: "flex", borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.slate}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            <div style={{ width: 200, minWidth: 200, padding: "14px 20px", background: `${color}11`, borderRight: `3px solid ${color}`, fontSize: 13, fontWeight: 700, color }}>{label}</div>
            <div style={{ padding: "14px 20px", fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{value}</div>
          </div>
        ))}
      </div>
    </Page>
  );
};

// ─── Propose Workshop ─────────────────────────────────────────────────────────

const ProposeWorkshopPage = () => {
  const [form, setForm] = useState({ workshop_type: "", date: "", tnc_accepted: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [tncOpen, setTncOpen] = useState(false);
  const selectedType = WORKSHOP_TYPES.find(w => w.id === Number(form.workshop_type));

  const validate = () => {
    const e = {};
    if (!form.workshop_type) e.workshop_type = "Please select a workshop type.";
    if (!form.date) e.date = "Please select a date.";
    if (!form.tnc_accepted) e.tnc_accepted = "You must accept the terms and conditions.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  };

  if (submitted) return (
    <Page>
      <div style={{ maxWidth: 480, margin: "40px auto", background: "#f0fdf4", border: "1.5px solid #6ee7b7", borderRadius: 14, padding: "40px 32px", textAlign: "center", boxShadow: "0 4px 16px rgba(5,122,85,0.08)" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
        <h3 style={{ color: C.green, fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>Workshop Proposed Successfully!</h3>
        <p style={{ color: "#065f46", fontSize: 13 }}>Your proposal has been submitted and is pending instructor review.</p>
      </div>
    </Page>
  );

  return (
    <Page>
      <PageHeader title="Propose a Workshop" subtitle="Fill in the details below to submit your workshop proposal" color={C.teal} />
      <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 9, padding: "12px 18px", marginBottom: 24, fontSize: 13, color: "#1e40af", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <span>Before proposing, please check the <strong>Workshop Types</strong> section to learn about available workshops.</span>
      </div>

      <div style={{ maxWidth: 500, background: "#fff", border: `1.5px solid ${C.blue}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(26,86,219,0.08)" }}>
        <div style={{ background: C.blue, padding: "14px 20px" }}>
          <h3 style={{ color: "#fff", margin: 0, fontSize: 15, fontWeight: 700 }}>Propose Workshop</h3>
        </div>
        <div style={{ padding: "22px 24px" }}>
          <InputField label="Workshop Type" required error={errors.workshop_type}>
            <select value={form.workshop_type} onChange={e => setForm(f => ({ ...f, workshop_type: e.target.value }))} style={inputStyle}>
              <option value="">Select Workshop Type</option>
              {WORKSHOP_TYPES.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </InputField>

          <InputField label="Workshop Date" required error={errors.date}>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} min={new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]} />
          </InputField>

          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
            <input type="checkbox" id="tnc" checked={form.tnc_accepted} onChange={e => setForm(f => ({ ...f, tnc_accepted: e.target.checked }))} style={{ width: 16, height: 16, accentColor: C.blue }} />
            <label htmlFor="tnc" style={{ fontSize: 13, color: "#475569" }}>
              I accept the{" "}
              <button onClick={() => { if (!form.workshop_type) { setErrors(e => ({ ...e, workshop_type: "Please select a workshop type first." })); return; } setTncOpen(true); }}
                style={{ background: "none", border: "none", color: C.blue, fontWeight: 600, cursor: "pointer", textDecoration: "underline", padding: 0, fontSize: 13 }}>
                terms and conditions
              </button>
            </label>
          </div>
          {errors.tnc_accepted && <p style={{ color: C.red, fontSize: 12, margin: "0 0 12px" }}>{errors.tnc_accepted}</p>}

          <Btn onClick={handleSubmit} variant="success" size="lg" style={{ marginTop: 8, width: "100%" }}>Submit Proposal</Btn>
        </div>
      </div>

      {tncOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxWidth: 520, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.border}`, background: C.slate, borderRadius: "14px 14px 0 0" }}>
              <h5 style={{ margin: 0, fontWeight: 700, color: C.navy, fontSize: 15 }}>📋 Terms and Conditions</h5>
              <button onClick={() => setTncOpen(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: "18px 20px", fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
              {selectedType ? selectedType.terms_and_conditions : "Please select a workshop type first."}
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

// ─── Workshop Status — Coordinator ───────────────────────────────────────────

const WorkshopStatusCoordinatorPage = ({ user, setPage, setSelectedWorkshop }) => {
  const accepted = WORKSHOPS.filter(w => w.status && w.tnc_accepted);
  const proposed = WORKSHOPS.filter(w => !w.status && w.tnc_accepted);

  if (!WORKSHOPS.length) return (
    <Page>
      <div style={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32 }}>
        <h1 style={{ color: C.navy, fontSize: 22, margin: "0 0 8px" }}>Welcome, {user?.name}!</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Your workshop information will appear here. Use <strong>Propose Workshop</strong> to get started.</p>
      </div>
    </Page>
  );

  return (
    <Page>
      <PageHeader title="My Workshop Status" subtitle="Track all your submitted and accepted workshops" color={C.teal} />
      <div style={{ marginBottom: 28 }}>
        <SectionHeading color={C.green}>Workshops Accepted</SectionHeading>
        <StyledTable accentColor={C.green}
          headers={["Workshop Name", "Instructor", "Workshop Date", "Status"]}
          emptyMsg="No accepted workshops yet."
          rows={accepted.map(w => [
            <Td key="n"><button onClick={() => { setSelectedWorkshop(w.id); setPage("workshop_details"); }} style={{ background: "none", border: "none", color: C.blue, fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0 }}>{w.workshop_type}</button></Td>,
            <Td key="i">{w.instructor || "—"}</Td>,
            <Td key="d"><span style={{ background: "#f0f9ff", color: C.teal, border: "1px solid #bae6fd", borderRadius: 5, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>{w.date}</span></Td>,
            <Td key="s"><Badge status={true} /></Td>,
          ])}
        />
      </div>
      <SectionHeading color={C.amber}>Workshops Proposed By Me</SectionHeading>
      <StyledTable accentColor={C.amber}
        headers={["Workshop Name", "Workshop Date", "Status"]}
        emptyMsg="No pending proposals."
        rows={proposed.map(w => [
          <Td key="n"><button onClick={() => { setSelectedWorkshop(w.id); setPage("workshop_details"); }} style={{ background: "none", border: "none", color: C.blue, fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0 }}>{w.workshop_type}</button></Td>,
          <Td key="d"><span style={{ background: "#fffbeb", color: C.amber, border: "1px solid #fcd34d", borderRadius: 5, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>{w.date}</span></Td>,
          <Td key="s"><Badge status={false} /></Td>,
        ])}
      />
    </Page>
  );
};

// ─── Workshop Status — Instructor ─────────────────────────────────────────────

const WorkshopStatusInstructorPage = ({ user, setPage, setSelectedWorkshop }) => {
  const [accepted, setAccepted] = useState(WORKSHOPS.filter(w => w.status && w.tnc_accepted));
  const [proposed, setProposed] = useState(WORKSHOPS.filter(w => !w.status && w.tnc_accepted));

  const handleAccept = (workshop) => {
    if (window.confirm("Once accepted you cannot reject. Are you sure you want to accept this workshop?")) {
      setProposed(p => p.filter(w => w.id !== workshop.id));
      setAccepted(a => [...a, { ...workshop, status: true }]);
    }
  };

  return (
    <Page>
      <PageHeader title="Instructor Dashboard" subtitle="Manage accepted workshops and review new proposals" color={C.indigo} />
      <div style={{ marginBottom: 28 }}>
        <SectionHeading color={C.green}>Workshops Accepted</SectionHeading>
        <StyledTable accentColor={C.green}
          headers={["Coordinator", "Institute", "Workshop Name", "Date", "Status"]}
          emptyMsg="No accepted workshops."
          rows={accepted.map(w => [
            <Td key="c" style={{ color: C.blue, fontWeight: 600 }}>{w.coordinator}</Td>,
            <Td key="i">IIT Bombay</Td>,
            <Td key="n" style={{ fontWeight: 600 }}>{w.workshop_type}</Td>,
            <Td key="d"><span style={{ background: "#f0f9ff", color: C.teal, border: "1px solid #bae6fd", borderRadius: 5, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>{w.date}</span></Td>,
            <Td key="s"><Badge status={true} /></Td>,
          ])}
        />
      </div>
      <SectionHeading color={C.blue}>Proposals Awaiting Review</SectionHeading>
      <StyledTable accentColor={C.blue}
        headers={["Coordinator", "Institute", "Workshop Name", "Date", "Status", "Action"]}
        emptyMsg="No pending proposals."
        rows={proposed.map(w => [
          <Td key="c" style={{ color: C.blue, fontWeight: 600 }}>{w.coordinator}</Td>,
          <Td key="i">IIT Bombay</Td>,
          <Td key="n" style={{ fontWeight: 600 }}>{w.workshop_type}</Td>,
          <Td key="d">{w.date}</Td>,
          <Td key="s"><Badge status={false} /></Td>,
          <Td key="a"><Btn onClick={() => handleAccept(w)} variant="success" size="sm">✓ Accept</Btn></Td>,
        ])}
      />
    </Page>
  );
};

// ─── Workshop Details ─────────────────────────────────────────────────────────

const WorkshopDetailsPage = ({ workshopId, setPage, setSelectedWorkshopType, user }) => {
  const w = WORKSHOPS.find(ws => ws.id === workshopId) || WORKSHOPS[0];
  const [newComment, setNewComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [comments, setComments] = useState(w.comments || []);
  const isInstructor = user?.role === "instructor";

  const postComment = () => {
    if (!newComment.trim()) return;
    setComments(c => [...c, { id: Date.now(), author: user?.name || "You", author_id: 1, comment: newComment, public: isPublic, created_date: new Date().toISOString().split("T")[0] }]);
    setNewComment("");
  };

  const detailRows = [
    ["Workshop Type", <button onClick={() => { setSelectedWorkshopType(w.workshop_type_id); setPage("workshop_type_details"); }} style={{ background: "none", border: "none", color: C.blue, fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0, textDecoration: "underline" }}>{w.workshop_type}</button>, C.blue],
    ["Date", <span style={{ background: "#f0f9ff", color: C.teal, border: "1px solid #bae6fd", borderRadius: 5, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>{w.date}</span>, C.teal],
    ["Coordinator", w.coordinator, C.indigo],
    ["Status", <Badge status={w.status} />, w.status ? C.green : C.amber],
    ...(w.status ? [["Instructor", w.instructor, C.green]] : []),
  ];

  return (
    <Page>
      <PageHeader title="Workshop Details" color={C.navy} />
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {detailRows.map(([label, value, color]) => (
          <div key={label} style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}
            onMouseEnter={e => e.currentTarget.style.background = C.slate}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            <div style={{ width: 180, minWidth: 180, padding: "12px 18px", background: `${color}11`, borderRight: `3px solid ${color}`, fontSize: 13, fontWeight: 700, color, display: "flex", alignItems: "center" }}>{label}</div>
            <div style={{ padding: "12px 18px", fontSize: 13, color: "#334155", display: "flex", alignItems: "center" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Comment box */}
      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ background: C.slate, borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>💬 Post a Comment</span>
          {isInstructor && (
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
              <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} style={{ accentColor: C.blue }} /> Public
              <span style={{ color: "#94a3b8" }}>(unchecked = instructors only)</span>
            </label>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} placeholder="Write your comment..." style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ padding: "0 16px 14px", display: "flex", justifyContent: "flex-end" }}>
          <Btn onClick={postComment} variant="primary">Post Comment</Btn>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Comments</h3>
      {comments.map(c => (
        <div key={c.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ background: C.slate, borderBottom: `1px solid ${C.border}`, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blue}, ${C.teal})`, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.author[0]}</div>
            <span style={{ fontWeight: 600, fontSize: 13, color: C.blue }}>{c.author}</span>
            {!c.public && <span style={{ background: "#1e293b", color: "#fff", fontSize: 10, padding: "1px 7px", borderRadius: 99, fontWeight: 600 }}>Hidden</span>}
            <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}>{c.created_date}</span>
          </div>
          <div style={{ padding: "10px 16px", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{c.comment}</div>
        </div>
      ))}
      {!comments.length && <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>No comments yet.</p>}
    </Page>
  );
};

// ─── View Profile ─────────────────────────────────────────────────────────────

const ViewProfilePage = ({ user, setPage }) => {
  const hasWorkshops = WORKSHOPS.some(w => w.status);
  const [form, setForm] = useState({ title: "Mr", first_name: user?.name?.split(" ")[0] || "", last_name: user?.name?.split(" ")[1] || "", phone_number: "", institute: "", department: "", position: "", location: "", state: "" });

  if (hasWorkshops) return (
    <Page>
      <PageHeader title="My Profile" color={C.indigo} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        {[
          ["First name", user?.name?.split(" ")[0] || "", C.blue],
          ["Last name", user?.name?.split(" ")[1] || "", C.blue],
          ["Email", user?.email || "", C.teal],
          ["Institute", "IIT Bombay", C.indigo],
          ["Phone", "+91 9876543210", C.navy],
          ["Department", "Computer Science", C.navy],
          ["Location", "Mumbai", C.amber],
          ["Position", user?.role || "coordinator", C.green],
        ].map(([label, value, color]) => (
          <div key={label} style={{ background: C.slate, borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>
      <SectionHeading color={C.teal}>Workshop History</SectionHeading>
      <StyledTable accentColor={C.teal}
        headers={["Instructor", "Workshop Date", "Workshop Type"]}
        emptyMsg="No workshop history."
        rows={WORKSHOPS.map(w => [
          <Td key="i">{w.instructor ? w.instructor : <span style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>Pending</span>}</Td>,
          <Td key="d">{w.date}</Td>,
          <Td key="t" style={{ fontWeight: 600 }}>{w.workshop_type}</Td>,
        ])}
      />
    </Page>
  );

  return (
    <Page>
      <PageHeader title="Edit Profile" subtitle="Update your account information" color={C.indigo} />
      <div style={{ maxWidth: 520, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        {[
          { label: "Title", key: "title", type: "select", options: ["Mr", "Mrs", "Ms", "Dr", "Prof"] },
          { label: "First Name", key: "first_name" },
          { label: "Last Name", key: "last_name" },
          { label: "Phone Number", key: "phone_number" },
          { label: "Institute", key: "institute" },
          { label: "Department", key: "department" },
          { label: "Position", key: "position" },
          { label: "Location", key: "location" },
          { label: "State", key: "state", type: "select", options: STATES },
        ].map(field => (
          <InputField key={field.key} label={field.label}>
            {field.type === "select"
              ? <select value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} style={inputStyle}>{field.options.map(o => <option key={o} value={o}>{o}</option>)}</select>
              : <input type="text" value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} style={inputStyle} />
            }
          </InputField>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <Btn variant="success" size="lg">✏ Update</Btn>
          <Btn onClick={() => setPage("workshop_types")} variant="outlineGray" size="lg">Cancel</Btn>
        </div>
      </div>
    </Page>
  );
};

// ─── Statistics ───────────────────────────────────────────────────────────────

const StatisticsPage = ({ user }) => {
  const [filters, setFilters] = useState({ from_date: "", to_date: "", workshop_type: "", state: "", sort: "date", show_workshops: false });
  const clearFilters = () => setFilters({ from_date: "", to_date: "", workshop_type: "", state: "", sort: "date", show_workshops: false });

  return (
    <Page>
      <PageHeader title="Workshop Statistics" subtitle="Explore and filter workshop records across India" color={C.navy} />
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Sidebar */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ background: C.navy, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>🔍 Filters</span>
              <button onClick={clearFilters} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 5, cursor: "pointer", fontWeight: 600 }}>✕ Clear</button>
            </div>
            <div style={{ padding: 14 }}>
              {[["From date", "from_date"], ["To date", "to_date"]].map(([label, key]) => (
                <InputField key={key} label={label}>
                  <input type="date" value={filters[key]} onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} />
                </InputField>
              ))}
              <InputField label="Workshop">
                <select value={filters.workshop_type} onChange={e => setFilters(p => ({ ...p, workshop_type: e.target.value }))} style={inputStyle}>
                  <option value="">All</option>
                  {WORKSHOP_TYPES.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </InputField>
              <InputField label="State">
                <select value={filters.state} onChange={e => setFilters(p => ({ ...p, state: e.target.value }))} style={inputStyle}>
                  <option value="">All</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </InputField>
              <InputField label="Sort by">
                <select value={filters.sort} onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))} style={inputStyle}>
                  <option value="date">Date</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="workshop_type">Workshop Type</option>
                </select>
              </InputField>
              {user && (
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#475569", marginBottom: 14 }}>
                  <input type="checkbox" checked={filters.show_workshops} onChange={e => setFilters(p => ({ ...p, show_workshops: e.target.checked }))} style={{ accentColor: C.blue }} /> Show my workshops
                </label>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="success" size="sm" style={{ flex: 1 }}>👁 View</Btn>
                <Btn variant="teal" size="sm" style={{ flex: 1 }}>⬇ Export</Btn>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Btn variant="outline" size="sm">📊 State Chart</Btn>
            <Btn variant="outline" size="sm">📊 Type Chart</Btn>
          </div>
          <StyledTable accentColor={C.navy}
            headers={["Sr No.", "Coordinator", "Institute", "Instructor", "Workshop", "Date"]}
            emptyMsg="No workshop records found."
            rows={WORKSHOPS.filter(w => w.status).map((w, i) => [
              <Td key="sr"><span style={{ background: "#e0e7ff", color: C.indigo, borderRadius: 5, padding: "1px 8px", fontSize: 12, fontWeight: 700 }}>{i + 1}</span></Td>,
              <Td key="c" style={{ fontWeight: 600, color: C.navy }}>{w.coordinator}</Td>,
              <Td key="i">IIT Bombay</Td>,
              <Td key="ins">{w.instructor || "—"}</Td>,
              <Td key="w" style={{ fontWeight: 500 }}>{w.workshop_type}</Td>,
              <Td key="d"><span style={{ background: "#f0f9ff", color: C.teal, border: "1px solid #bae6fd", borderRadius: 5, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>{w.date}</span></Td>,
            ])}
          />
        </div>
      </div>
    </Page>
  );
};

// ─── Login ────────────────────────────────────────────────────────────────────

const LoginPage = ({ onLogin, setPage }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.username || !form.password) { setError("Please fill in all fields."); return; }
    if (form.username === "coordinator" && form.password === "pass123") onLogin({ name: "Anjali Sharma", role: "coordinator", email: "anjali@iitb.ac.in" });
    else if (form.username === "instructor" && form.password === "pass123") onLogin({ name: "Dr. Ramesh Kumar", role: "instructor", email: "ramesh@iitb.ac.in" });
    else setError("Invalid username or password.");
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 12 }}>🎓</div>
          <h2 style={{ color: C.navy, fontWeight: 800, fontSize: 22, margin: 0 }}>Sign in to FOSSEE</h2>
          <p style={{ color: "#64748b", fontSize: 13, margin: "6px 0 0" }}>Enter your credentials to continue</p>
        </div>
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ padding: "24px 24px 20px" }}>
            {error && <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.red, marginBottom: 16, fontWeight: 500 }}>{error}</div>}
            <InputField label="Username">
              <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} style={inputStyle} placeholder="Enter username" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </InputField>
            <InputField label="Password">
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} placeholder="Enter password" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </InputField>
            <Btn onClick={handleSubmit} variant="primary" size="lg" style={{ width: "100%", marginTop: 4 }}>Sign In →</Btn>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, background: C.slate, padding: "14px 24px" }}>
            <button onClick={() => setPage("register")} style={{ background: "none", border: "none", color: C.blue, fontSize: 13, cursor: "pointer", padding: 0, fontWeight: 500 }}>New here? Create an account</button>
            <span style={{ color: "#cbd5e1", margin: "0 8px" }}>·</span>
            <button style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", padding: 0 }}>Forgot password?</button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 14 }}>Demo: <strong>coordinator</strong> / pass123 &nbsp;·&nbsp; <strong>instructor</strong> / pass123</p>
      </div>
    </div>
  );
};

// ─── Register ─────────────────────────────────────────────────────────────────

const RegisterPage = ({ setPage }) => {
  const [form, setForm] = useState({ title: "", first_name: "", last_name: "", username: "", email: "", password: "", confirm: "", phone_number: "", institute: "", department: "", position: "", location: "", state: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.first_name) e.first_name = "Required";
    if (!form.last_name) e.last_name = "Required";
    if (!form.username) e.username = "Required";
    if (!form.email || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setDone(true);
  };

  if (done) return (
    <Page>
      <div style={{ maxWidth: 480, margin: "40px auto", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 14, padding: "40px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
        <h3 style={{ color: C.blue, fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>Registration Successful!</h3>
        <p style={{ color: "#1e40af", fontSize: 13, marginBottom: 20 }}>Check your inbox to activate your account.</p>
        <Btn onClick={() => setPage("login")} variant="primary" size="lg">Go to Login</Btn>
      </div>
    </Page>
  );

  return (
    <Page>
      <PageHeader title="Coordinator Registration" subtitle="Create your FOSSEE workshops account" color={C.blue} />
      <div style={{ maxWidth: 560, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <InputField label="Title">
          <select value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle}>
            <option value="">---------</option>
            {["Mr", "Mrs", "Ms", "Dr", "Prof"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </InputField>
        {[
          { key: "first_name", label: "First Name", required: true },
          { key: "last_name", label: "Last Name", required: true },
          { key: "username", label: "Username", required: true },
          { key: "email", label: "Email", type: "email", required: true },
          { key: "password", label: "Password", type: "password", required: true },
          { key: "confirm", label: "Confirm Password", type: "password", required: true },
          { key: "phone_number", label: "Phone Number" },
          { key: "institute", label: "Institute" },
          { key: "department", label: "Department" },
          { key: "position", label: "Position" },
          { key: "location", label: "Location" },
        ].map(f => (
          <InputField key={f.key} label={f.label} required={f.required} error={errors[f.key]}>
            <input type={f.type || "text"} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
          </InputField>
        ))}
        <InputField label="State">
          <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={inputStyle}>
            <option value="">---------</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </InputField>
        <Btn onClick={handleSubmit} variant="primary" size="lg" style={{ marginTop: 4 }}>Register →</Btn>
      </div>
    </Page>
  );
};

// ─── Add Workshop Type ────────────────────────────────────────────────────────

const AddWorkshopTypePage = ({ setPage }) => {
  const [form, setForm] = useState({ name: "", duration: "", description: "", terms_and_conditions: "" });
  const [done, setDone] = useState(false);

  if (done) return (
    <Page>
      <div style={{ maxWidth: 420, margin: "40px auto", background: "#f0fdf4", border: "1.5px solid #6ee7b7", borderRadius: 14, padding: "36px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
        <h3 style={{ color: C.green, fontWeight: 700, fontSize: 17, margin: "0 0 16px" }}>Workshop Type Added!</h3>
        <Btn onClick={() => setPage("workshop_types")} variant="primary">← Back to Workshop Types</Btn>
      </div>
    </Page>
  );

  return (
    <Page>
      <PageHeader title="Add Workshop Type" color={C.teal} />
      <div style={{ maxWidth: 540, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        {[
          { key: "name", label: "Workshop Name" },
          { key: "duration", label: "Duration (Days)" },
          { key: "description", label: "Description", textarea: true },
          { key: "terms_and_conditions", label: "Terms and Conditions", textarea: true },
        ].map(f => (
          <InputField key={f.key} label={f.label}>
            {f.textarea
              ? <textarea rows={3} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
              : <input type="text" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
            }
          </InputField>
        ))}
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => setDone(true)} variant="success" size="lg">Add Workshop Type</Btn>
          <Btn onClick={() => setPage("workshop_types")} variant="outlineGray" size="lg">Cancel</Btn>
        </div>
      </div>
    </Page>
  );
};

// ─── App ────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("workshop_types");
  const [selectedWorkshopType, setSelectedWorkshopType] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const navigate = (p) => {
    if (["workshop_status", "propose", "profile", "add_workshop_type"].includes(p) && !user) { setPage("login"); return; }
    setPage(p);
  };

  const renderPage = () => {
    switch (page) {
      case "workshop_types":      return <WorkshopTypeListPage user={user} setPage={navigate} setSelectedWorkshopType={setSelectedWorkshopType} />;
      case "workshop_type_details": return <WorkshopTypeDetailsPage workshopTypeId={selectedWorkshopType} />;
      case "propose":             return <ProposeWorkshopPage />;
      case "workshop_status":     return user?.role === "instructor"
        ? <WorkshopStatusInstructorPage user={user} setPage={navigate} setSelectedWorkshop={setSelectedWorkshop} />
        : <WorkshopStatusCoordinatorPage user={user} setPage={navigate} setSelectedWorkshop={setSelectedWorkshop} />;
      case "workshop_details":    return <WorkshopDetailsPage workshopId={selectedWorkshop} setPage={navigate} setSelectedWorkshopType={setSelectedWorkshopType} user={user} />;
      case "profile":             return <ViewProfilePage user={user} setPage={navigate} />;
      case "statistics":
      case "team_stats":          return <StatisticsPage user={user} />;
      case "add_workshop_type":   return <AddWorkshopTypePage setPage={navigate} />;
      case "login":               return <LoginPage onLogin={(u) => { setUser(u); setPage("workshop_types"); }} setPage={navigate} />;
      case "register":            return <RegisterPage setPage={navigate} />;
      default:                    return <WorkshopTypeListPage user={user} setPage={navigate} setSelectedWorkshopType={setSelectedWorkshopType} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Navbar user={user} page={page} setPage={navigate} onLogout={() => { setUser(null); setPage("workshop_types"); }} />
      <main style={{ flex: 1, paddingTop: 56 }}>{renderPage()}</main>
      <Footer />
    </div>
  );
}