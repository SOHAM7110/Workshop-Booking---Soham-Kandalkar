import { useState } from "react";

// ─── Mock Data (mirrors Django models) ──────────────────────────────────────

const WORKSHOP_TYPES = [
  { id: 1, name: "Python for Scientific Computing", duration: 2, description: "An introductory workshop covering Python fundamentals for scientific applications including NumPy, SciPy, and Matplotlib.", terms_and_conditions: "Participants must bring their own laptops. Internet connection required. Basic programming knowledge preferred." },
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

// ─── Reusable UI Atoms ───────────────────────────────────────────────────────

const Badge = ({ status }) => {
  const styles = status
    ? "bg-green-100 text-green-800 border border-green-200"
    : "bg-yellow-100 text-yellow-800 border border-yellow-200";
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles}`}>
      {status ? "Accepted" : "Pending"}
    </span>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────────────

const Navbar = ({ user, page, setPage, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const isInstructor = user?.role === "instructor";

  return (
    <nav style={{ background: "#1a1a2e" }} className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <button onClick={() => setPage("workshop_types")} className="text-white font-bold text-base tracking-wide hover:text-blue-300 transition-colors">
          FOSSEE Workshops
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink label="Home" active={page === "workshop_types"} onClick={() => setPage("workshop_types")} />
          <NavLink label="Workshop Statistics" active={page === "statistics"} onClick={() => setPage("statistics")} />
          {user && (
            <>
              {isInstructor && <NavLink label="Team Statistics" active={page === "team_stats"} onClick={() => setPage("team_stats")} />}
              <NavLink label="Workshop Status" active={page === "workshop_status"} onClick={() => setPage("workshop_status")} />
              {!isInstructor && <NavLink label="Propose Workshop" active={page === "propose"} onClick={() => setPage("propose")} />}
              <NavLink label="Workshop Types" active={false} onClick={() => setPage("workshop_types")} />
            </>
          )}
          {user ? (
            <div className="relative ml-2">
              <button onClick={() => setDropOpen(o => !o)} className="flex items-center gap-1 text-white text-sm px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
                <span className="text-lg">👤</span>
                <span>{user.name}</span>
                <span className="text-xs">▾</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded shadow-lg border border-gray-200 min-w-40 z-50" onMouseLeave={() => setDropOpen(false)}>
                  <button onClick={() => { setPage("profile"); setDropOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</button>
                  <button onClick={() => { setPage("change_password"); setDropOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Change Password</button>
                  <hr className="border-gray-200" />
                  <button onClick={() => { onLogout(); setDropOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-2">
              <button onClick={() => setPage("login")} className="text-white text-sm px-3 py-1.5 rounded hover:bg-white/10 transition-colors">Sign In</button>
              <button onClick={() => setPage("register")} className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">Register</button>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(o => !o)} className="md:hidden text-white text-xl p-1">☰</button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#1a1a2e" }} className="md:hidden border-t border-white/10 px-4 py-2 space-y-1">
          {[
            { label: "Home", key: "workshop_types" },
            { label: "Workshop Statistics", key: "statistics" },
            ...(user ? [
              ...(isInstructor ? [{ label: "Team Statistics", key: "team_stats" }] : []),
              { label: "Workshop Status", key: "workshop_status" },
              ...(!isInstructor ? [{ label: "Propose Workshop", key: "propose" }] : []),
              { label: "Profile", key: "profile" },
            ] : [
              { label: "Sign In", key: "login" },
              { label: "Register", key: "register" },
            ])
          ].map(item => (
            <button key={item.key} onClick={() => { setPage(item.key); setMenuOpen(false); }} className="block w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-white/10">
              {item.label}
            </button>
          ))}
          {user && <button onClick={() => { onLogout(); setMenuOpen(false); }} className="block w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-white/10">Logout</button>}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`text-sm px-3 py-1.5 rounded transition-colors ${active ? "text-white bg-white/20" : "text-gray-300 hover:text-white hover:bg-white/10"}`}>
    {label}
  </button>
);

// ─── Footer ──────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer style={{ background: "#1a1a2e" }} className="text-gray-400 text-sm text-center py-4 mt-8">
    Developed by FOSSEE group, IIT Bombay
  </footer>
);

// ─── Workshop Type List ───────────────────────────────────────────────────────

const WorkshopTypeListPage = ({ user, setPage, setSelectedWorkshopType }) => {
  const isInstructor = user?.role === "instructor";
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Workshop Types</h2>
      {isInstructor && (
        <div className="flex justify-end mb-3">
          <button onClick={() => setPage("add_workshop_type")} className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">
            Add Workshop Type
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 border border-gray-200 font-semibold">Sr No</th>
              <th className="px-4 py-3 border border-gray-200 font-semibold">Workshop Name</th>
              <th className="px-4 py-3 border border-gray-200 font-semibold">Workshop Duration (Days)</th>
              <th className="px-4 py-3 border border-gray-200 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {WORKSHOP_TYPES.map((w, i) => (
              <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 border border-gray-200">{i + 1}</td>
                <td className="px-4 py-3 border border-gray-200">{w.name}</td>
                <td className="px-4 py-3 border border-gray-200">{w.duration}</td>
                <td className="px-4 py-3 border border-gray-200">
                  <button
                    onClick={() => { setSelectedWorkshopType(w.id); setPage("workshop_type_details"); }}
                    className="border border-blue-400 text-blue-600 text-xs px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
                  >
                    View Workshop Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Workshop Type Details ────────────────────────────────────────────────────

const WorkshopTypeDetailsPage = ({ workshopTypeId }) => {
  const wt = WORKSHOP_TYPES.find(w => w.id === workshopTypeId) || WORKSHOP_TYPES[0];
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Workshop Details</h2>
      <table className="w-full border-collapse text-sm max-w-3xl mx-auto">
        {[
          ["Workshop Name :", wt.name],
          ["Duration :", `${wt.duration} day(s)`],
          ["Description :", wt.description],
          ["Terms and Conditions :", wt.terms_and_conditions],
        ].map(([label, value]) => (
          <tr key={label} className="hover:bg-gray-50">
            <th className="px-4 py-3 border border-gray-300 bg-gray-50 font-semibold text-gray-700 text-left w-48 align-top">{label}</th>
            <td className="px-4 py-3 border border-gray-300 text-gray-800">{value}</td>
          </tr>
        ))}
      </table>
    </div>
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
    <div className="container mx-auto px-4 py-10 text-center">
      <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded p-8">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Workshop Proposed Successfully</h3>
        <p className="text-green-700 text-sm">Your workshop proposal has been submitted and is pending review.</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded px-4 py-3 mb-6 max-w-2xl mx-auto">
        Note: Before proposing the workshop, please check about the workshop in the <strong>Workshop Types</strong> section.
      </div>

      <div className="max-w-md mx-auto">
        <div className="border border-blue-400 rounded">
          <div className="border-b border-blue-400 px-5 py-3">
            <h3 className="text-lg font-semibold text-gray-800">Propose Workshop</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <select
                value={form.workshop_type}
                onChange={e => setForm(f => ({ ...f, workshop_type: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="">Select Workshop Type</option>
                {WORKSHOP_TYPES.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              {errors.workshop_type && <p className="text-red-600 text-xs mt-1">{errors.workshop_type}</p>}
            </div>

            <div>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                min={new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]}
              />
              {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                id="tnc"
                checked={form.tnc_accepted}
                onChange={e => setForm(f => ({ ...f, tnc_accepted: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="tnc" className="text-gray-700">
                I accept the{" "}
                <button
                  onClick={() => {
                    if (!form.workshop_type) { setErrors(e => ({ ...e, workshop_type: "Please select a workshop type first." })); return; }
                    setTncOpen(true);
                  }}
                  className="text-blue-600 underline"
                >
                  terms and conditions
                </button>
              </label>
            </div>
            {errors.tnc_accepted && <p className="text-red-600 text-xs">{errors.tnc_accepted}</p>}

            <button onClick={handleSubmit} className="bg-green-600 text-white text-sm px-5 py-2 rounded hover:bg-green-700 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* T&C Modal */}
      {tncOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center px-5 py-3 border-b">
              <h5 className="font-semibold text-gray-800">Terms and Conditions</h5>
              <button onClick={() => setTncOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl leading-none">×</button>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700">
              {selectedType ? selectedType.terms_and_conditions : "Please select a workshop type first."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Workshop Status (Coordinator view) ──────────────────────────────────────

const WorkshopStatusCoordinatorPage = ({ user, setPage, setSelectedWorkshop }) => {
  const accepted = WORKSHOPS.filter(w => w.status && w.tnc_accepted);
  const proposed = WORKSHOPS.filter(w => !w.status && w.tnc_accepted);

  if (!WORKSHOPS.length) return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gray-100 border rounded p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome {user?.name}</h1>
        <p className="text-gray-600">Information related to your workshops will be shown here. You can also propose a workshop in the <strong>Propose Workshop</strong> tab.</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">The status of your workshops</h3>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-center mb-3" style={{ color: "#04a9cf" }}>Workshops Accepted</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="px-4 py-2 border border-gray-200">Workshop Name</th>
                <th className="px-4 py-2 border border-gray-200">Instructor Name</th>
                <th className="px-4 py-2 border border-gray-200">Workshop Day</th>
                <th className="px-4 py-2 border border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {accepted.map(w => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">
                    <button onClick={() => { setSelectedWorkshop(w.id); setPage("workshop_details"); }} className="text-blue-600 hover:underline">
                      {w.workshop_type}
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-gray-200">{w.instructor || "—"}</td>
                  <td className="px-4 py-2 border border-gray-200">{w.date}</td>
                  <td className="px-4 py-2 border border-gray-200"><Badge status={true} /></td>
                </tr>
              ))}
              {!accepted.length && <tr><td colSpan={4} className="px-4 py-3 border border-gray-200 text-gray-400 text-center text-xs">No accepted workshops</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-center mb-3" style={{ color: "#04a9cf" }}>Workshops Proposed By Me</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="px-4 py-2 border border-gray-200">Workshop Name</th>
                <th className="px-4 py-2 border border-gray-200">Workshop Day</th>
                <th className="px-4 py-2 border border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {proposed.map(w => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">
                    <button onClick={() => { setSelectedWorkshop(w.id); setPage("workshop_details"); }} className="text-blue-600 hover:underline">
                      {w.workshop_type}
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-gray-200">{w.date}</td>
                  <td className="px-4 py-2 border border-gray-200"><Badge status={false} /></td>
                </tr>
              ))}
              {!proposed.length && <tr><td colSpan={3} className="px-4 py-3 border border-gray-200 text-gray-400 text-center text-xs">No pending workshops</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Workshop Status (Instructor view) ───────────────────────────────────────

const WorkshopStatusInstructorPage = ({ user, setPage, setSelectedWorkshop }) => {
  const [accepted, setAccepted] = useState(WORKSHOPS.filter(w => w.status && w.tnc_accepted));
  const [proposed, setProposed] = useState(WORKSHOPS.filter(w => !w.status && w.tnc_accepted));

  if (!WORKSHOPS.length) return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gray-100 border rounded p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome {user?.name}</h1>
        <p className="text-gray-600">Your workshop related information will be shown here. Please navigate to <b>Workshop list</b> and depending upon your expertise and availability create a workshop.</p>
      </div>
    </div>
  );

  const handleAccept = (workshop) => {
    if (window.confirm("Once accepted you cannot reject, you have to personally contact the Coordinator if the workshop is to be cancelled. Are you sure you want to accept the workshop?")) {
      setProposed(p => p.filter(w => w.id !== workshop.id));
      setAccepted(a => [...a, { ...workshop, status: true }]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">The status of your workshops</h3>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-center mb-3" style={{ color: "#04a9cf" }}>Workshops Accepted</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="px-4 py-2 border border-gray-200">Coordinator Name</th>
                <th className="px-4 py-2 border border-gray-200">Institute</th>
                <th className="px-4 py-2 border border-gray-200">Workshop Name</th>
                <th className="px-4 py-2 border border-gray-200">Workshop Day</th>
                <th className="px-4 py-2 border border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {accepted.map(w => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200 text-blue-600 cursor-pointer hover:underline">{w.coordinator}</td>
                  <td className="px-4 py-2 border border-gray-200">IIT Bombay</td>
                  <td className="px-4 py-2 border border-gray-200">{w.workshop_type}</td>
                  <td className="px-4 py-2 border border-gray-200">{w.date}</td>
                  <td className="px-4 py-2 border border-gray-200"><Badge status={true} /></td>
                </tr>
              ))}
              {!accepted.length && <tr><td colSpan={5} className="px-4 py-3 border border-gray-200 text-gray-400 text-center text-xs">No accepted workshops</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-center mb-3" style={{ color: "#04a9cf" }}>Workshops Proposed By Coordinators</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="px-4 py-2 border border-gray-200">Coordinator Name</th>
                <th className="px-4 py-2 border border-gray-200">Institute</th>
                <th className="px-4 py-2 border border-gray-200">Workshop Name</th>
                <th className="px-4 py-2 border border-gray-200">Workshop Day</th>
                <th className="px-4 py-2 border border-gray-200">Status</th>
                <th className="px-4 py-2 border border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {proposed.map(w => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200 text-blue-600 cursor-pointer hover:underline">{w.coordinator}</td>
                  <td className="px-4 py-2 border border-gray-200">IIT Bombay</td>
                  <td className="px-4 py-2 border border-gray-200">{w.workshop_type}</td>
                  <td className="px-4 py-2 border border-gray-200">{w.date}</td>
                  <td className="px-4 py-2 border border-gray-200"><Badge status={false} /></td>
                  <td className="px-4 py-2 border border-gray-200">
                    <button onClick={() => handleAccept(w)} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">Accept</button>
                  </td>
                </tr>
              ))}
              {!proposed.length && <tr><td colSpan={6} className="px-4 py-3 border border-gray-200 text-gray-400 text-center text-xs">No pending proposals</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
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

  return (
    <div className="container mx-auto px-4 py-6">
      <table className="w-full border-collapse text-sm max-w-3xl mx-auto mb-8">
        <tbody>
          <tr className="hover:bg-gray-50">
            <th className="px-4 py-3 border border-gray-300 bg-gray-50 font-semibold text-gray-700 text-left w-44 align-top">Workshop Type :</th>
            <td className="px-4 py-3 border border-gray-300 text-gray-800">
              <button onClick={() => { setSelectedWorkshopType(w.workshop_type_id); setPage("workshop_type_details"); }} className="text-blue-600 hover:underline">{w.workshop_type}</button>
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="px-4 py-3 border border-gray-300 bg-gray-50 font-semibold text-gray-700 text-left align-top">Date :</th>
            <td className="px-4 py-3 border border-gray-300 text-gray-800">{w.date}</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="px-4 py-3 border border-gray-300 bg-gray-50 font-semibold text-gray-700 text-left align-top">Coordinator :</th>
            <td className="px-4 py-3 border border-gray-300 text-gray-800">{w.coordinator}</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="px-4 py-3 border border-gray-300 bg-gray-50 font-semibold text-gray-700 text-left align-top">Status :</th>
            <td className="px-4 py-3 border border-gray-300"><Badge status={w.status} /></td>
          </tr>
          {w.status && (
            <tr className="hover:bg-gray-50">
              <th className="px-4 py-3 border border-gray-300 bg-gray-50 font-semibold text-gray-700 text-left align-top">Instructor :</th>
              <td className="px-4 py-3 border border-gray-300 text-gray-800">{w.instructor}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="max-w-3xl mx-auto">
        <div className="border rounded mb-4">
          <div className="border-b px-4 py-2 flex items-center gap-4">
            <span className="font-semibold text-sm text-gray-700">Post a comment</span>
            {isInstructor && (
              <>
                <label className="flex items-center gap-1 text-sm text-gray-600">
                  <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="w-3.5 h-3.5" /> Public
                </label>
                <span className="text-xs text-gray-400">(Non-public comments are visible only to instructors)</span>
              </>
            )}
          </div>
          <div className="p-4">
            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" placeholder="Write a comment..." />
          </div>
          <div className="flex justify-end px-4 pb-3">
            <button onClick={postComment} className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 float-right">Post</button>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Comments</h2>
        {comments.map(c => (
          <div key={c.id} className="border rounded mb-3">
            <div className="border-b px-4 py-2 flex items-center gap-2">
              <span className="font-semibold text-sm text-blue-600 hover:underline cursor-pointer">{c.author}</span>
              {!c.public && <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">Hidden</span>}
              <span className="text-xs text-gray-400 ml-1">{c.created_date}</span>
            </div>
            <div className="px-4 py-3 text-sm text-gray-700">{c.comment}</div>
          </div>
        ))}
        {!comments.length && <p className="text-center text-gray-400 text-sm">No comments yet.</p>}
      </div>
    </div>
  );
};

// ─── View Profile ─────────────────────────────────────────────────────────────

const ViewProfilePage = ({ user, setPage }) => {
  const hasWorkshops = WORKSHOPS.some(w => w.status);
  const [form, setForm] = useState({ title: "Mr", first_name: user?.name?.split(" ")[0] || "", last_name: user?.name?.split(" ")[1] || "", phone_number: "", institute: "", department: "", position: "", location: "", state: "" });

  if (hasWorkshops) return (
    <div className="container mx-auto px-4 py-6">
      <table className="w-full border-collapse text-sm max-w-3xl mx-auto mb-6">
        <tbody>
          {[
            ["First name:", user?.name?.split(" ")[0] || ""],
            ["Last name:", user?.name?.split(" ")[1] || ""],
            ["Email:", user?.email || ""],
            ["Institute:", "IIT Bombay"],
            ["Phone Number:", "+91 9876543210"],
            ["Department:", "Computer Science"],
            ["Location:", "Mumbai"],
            ["Position:", user?.role || "coordinator"],
          ].map(([label, value]) => (
            <tr key={label} className="hover:bg-gray-50">
              <th className="px-4 py-3 border border-gray-300 bg-gray-50 font-semibold text-gray-700 text-left w-44"><label>{label}</label></th>
              <td className="px-4 py-3 border border-gray-300 text-gray-800"><label>{value}</label></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Workshop Details</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border border-gray-200 text-left"><label>Instructor name</label></th>
              <th className="px-4 py-2 border border-gray-200 text-left"><label>Workshop date</label></th>
              <th className="px-4 py-2 border border-gray-200 text-left"><label>Workshop type</label></th>
            </tr>
          </thead>
          <tbody>
            {WORKSHOPS.map(w => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-200">
                  {w.instructor ? <label>{w.instructor}</label> : <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-semibold">Pending</span>}
                </td>
                <td className="px-4 py-2 border border-gray-200"><label>{w.date}</label></td>
                <td className="px-4 py-2 border border-gray-200"><label>{w.workshop_type}</label></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Edit profile form
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-lg mx-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
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
              <tr key={field.key}>
                <td className="px-4 py-2 border border-gray-300 bg-gray-50 font-semibold text-gray-700 text-sm w-36">{field.label}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {field.type === "select" ? (
                    <select value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                      {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex gap-3">
          <button className="bg-green-600 text-white text-sm px-5 py-2 rounded hover:bg-green-700">✏ Update</button>
          <button onClick={() => setPage("workshop_types")} className="bg-blue-600 text-white text-sm px-5 py-2 rounded hover:bg-blue-700">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── Statistics (Public) ──────────────────────────────────────────────────────

const StatisticsPage = ({ user }) => {
  const [filters, setFilters] = useState({ from_date: "", to_date: "", workshop_type: "", state: "", sort: "date", show_workshops: false });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="border rounded">
            <div className="border-b px-4 py-3 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 underline">Filters</h3>
              <button onClick={() => setFilters({ from_date: "", to_date: "", workshop_type: "", state: "", sort: "date", show_workshops: false })} className="border border-blue-400 text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-50">✕ Clear</button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              {[["From date", "from_date"], ["To date", "to_date"]].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-gray-600 mb-1">{label}:</label>
                  <input type="date" value={filters[key]} onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
              ))}
              <div>
                <label className="block text-gray-600 mb-1">Workshop:</label>
                <select value={filters.workshop_type} onChange={e => setFilters(p => ({ ...p, workshop_type: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option value="">All</option>
                  {WORKSHOP_TYPES.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">State:</label>
                <select value={filters.state} onChange={e => setFilters(p => ({ ...p, state: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option value="">All</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Sort by:</label>
                <select value={filters.sort} onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option value="date">Date</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="workshop_type">Workshop Type</option>
                </select>
              </div>
              {user && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="show_workshops" checked={filters.show_workshops} onChange={e => setFilters(p => ({ ...p, show_workshops: e.target.checked }))} className="w-4 h-4" />
                  <label htmlFor="show_workshops" className="text-gray-600">Show my workshops</label>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button className="bg-green-600 text-white text-sm px-4 py-1.5 rounded hover:bg-green-700">👁 View</button>
                <button className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-600">⬇ Download</button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1">
          <div className="flex gap-2 mb-3">
            <button className="border border-blue-400 text-blue-600 text-sm px-3 py-1.5 rounded hover:bg-blue-50">📊 State chart</button>
            <button className="border border-blue-400 text-blue-600 text-sm px-3 py-1.5 rounded hover:bg-blue-50">📊 Workshops chart</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  {["Sr No.", "Coordinator Name", "Institute Name", "Instructor Name", "Workshop Name", "Workshop Date"].map(h => (
                    <th key={h} className="px-4 py-2 border border-gray-200 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WORKSHOPS.filter(w => w.status).map((w, i) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200">{i + 1}</td>
                    <td className="px-4 py-2 border border-gray-200">{w.coordinator}</td>
                    <td className="px-4 py-2 border border-gray-200">IIT Bombay</td>
                    <td className="px-4 py-2 border border-gray-200">{w.instructor || "—"}</td>
                    <td className="px-4 py-2 border border-gray-200">{w.workshop_type}</td>
                    <td className="px-4 py-2 border border-gray-200">{w.date}</td>
                  </tr>
                ))}
                {!WORKSHOPS.filter(w => w.status).length && (
                  <tr><td colSpan={6} className="px-4 py-4 border border-gray-200 text-gray-400 text-center">No workshop data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Login ────────────────────────────────────────────────────────────────────

const LoginPage = ({ onLogin, setPage }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.username || !form.password) { setError("Please fill in all fields."); return; }
    if (form.username === "coordinator" && form.password === "pass123") {
      onLogin({ name: "Anjali Sharma", role: "coordinator", email: "anjali@iitb.ac.in" });
    } else if (form.username === "instructor" && form.password === "pass123") {
      onLogin({ name: "Dr. Ramesh Kumar", role: "instructor", email: "ramesh@iitb.ac.in" });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-sm mx-auto">
        <div className="bg-white border border-gray-200 rounded shadow-sm">
          <div className="px-6 py-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2 mb-4">
                <strong>{error}</strong>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            <button onClick={handleSubmit} className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">Sign in</button>
          </div>
          <hr className="border-gray-200" />
          <div className="px-6 py-3 space-y-1">
            <button onClick={() => setPage("register")} className="block text-sm text-gray-700 hover:text-blue-600 py-0.5">New around here? Sign up</button>
            <button className="block text-sm text-gray-700 hover:text-blue-600 py-0.5">Forgot password?</button>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">Demo: coordinator / pass123 &nbsp;·&nbsp; instructor / pass123</p>
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
    <div className="container mx-auto px-4 py-10 text-center">
      <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded p-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Registration Successful!</h3>
        <p className="text-blue-700 text-sm mb-4">An activation email has been sent. Please check your inbox to activate your account.</p>
        <button onClick={() => setPage("login")} className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">Go to Login</button>
      </div>
    </div>
  );

  const inputField = (key, label, type = "text", required = false) => (
    <tr key={key}>
      <td className="px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500">*</span>}
      </td>
      <td className="px-4 py-2 border border-gray-300">
        <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
        {errors[key] && <p className="text-red-500 text-xs mt-0.5">{errors[key]}</p>}
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Coordinator Registration Form</h3>
      <table className="w-full border-collapse max-w-2xl">
        <tbody>
          <tr>
            <td className="px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">Title</td>
            <td className="px-4 py-2 border border-gray-300">
              <select value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                <option value="">---------</option>
                {["Mr", "Mrs", "Ms", "Dr", "Prof"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </td>
          </tr>
          {inputField("first_name", "First Name", "text", true)}
          {inputField("last_name", "Last Name", "text", true)}
          {inputField("username", "Username", "text", true)}
          {inputField("email", "Email", "email", true)}
          {inputField("password", "Password", "password", true)}
          {inputField("confirm", "Confirm Password", "password", true)}
          {inputField("phone_number", "Phone Number")}
          {inputField("institute", "Institute")}
          {inputField("department", "Department")}
          {inputField("position", "Position")}
          {inputField("location", "Location")}
          <tr>
            <td className="px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">State</td>
            <td className="px-4 py-2 border border-gray-300">
              <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                <option value="">---------</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white text-sm px-5 py-2 rounded hover:bg-blue-700">Register</button>
    </div>
  );
};

// ─── Add Workshop Type (Instructor only) ──────────────────────────────────────

const AddWorkshopTypePage = ({ setPage }) => {
  const [form, setForm] = useState({ name: "", duration: "", description: "", terms_and_conditions: "" });
  const [done, setDone] = useState(false);

  if (done) return (
    <div className="container mx-auto px-4 py-10 text-center">
      <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded p-8">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Workshop Type Added</h3>
        <button onClick={() => setPage("workshop_types")} className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 mt-2">Back to Workshop Types</button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Workshop Type</h3>
      <div className="space-y-4">
        {[
          { key: "name", label: "Workshop Name" },
          { key: "duration", label: "Duration (Days)" },
          { key: "description", label: "Description", textarea: true },
          { key: "terms_and_conditions", label: "Terms and Conditions", textarea: true },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            {f.textarea
              ? <textarea rows={3} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
              : <input type="text" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            }
          </div>
        ))}
        <div className="flex gap-3">
          <button onClick={() => setDone(true)} className="bg-green-600 text-white text-sm px-5 py-2 rounded hover:bg-green-700">Add Workshop Type</button>
          <button onClick={() => setPage("workshop_types")} className="bg-gray-500 text-white text-sm px-5 py-2 rounded hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("workshop_types");
  const [selectedWorkshopType, setSelectedWorkshopType] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const navigate = (p) => {
    if (["workshop_status", "propose", "profile", "add_workshop_type"].includes(p) && !user) {
      setPage("login");
      return;
    }
    setPage(p);
  };

  const renderPage = () => {
    switch (page) {
      case "workshop_types":
        return <WorkshopTypeListPage user={user} setPage={navigate} setSelectedWorkshopType={setSelectedWorkshopType} />;
      case "workshop_type_details":
        return <WorkshopTypeDetailsPage workshopTypeId={selectedWorkshopType} />;
      case "propose":
        return <ProposeWorkshopPage />;
      case "workshop_status":
        return user?.role === "instructor"
          ? <WorkshopStatusInstructorPage user={user} setPage={navigate} setSelectedWorkshop={setSelectedWorkshop} />
          : <WorkshopStatusCoordinatorPage user={user} setPage={navigate} setSelectedWorkshop={setSelectedWorkshop} />;
      case "workshop_details":
        return <WorkshopDetailsPage workshopId={selectedWorkshop} setPage={navigate} setSelectedWorkshopType={setSelectedWorkshopType} user={user} />;
      case "profile":
        return <ViewProfilePage user={user} setPage={navigate} />;
      case "statistics":
      case "team_stats":
        return <StatisticsPage user={user} />;
      case "add_workshop_type":
        return <AddWorkshopTypePage setPage={navigate} />;
      case "login":
        return <LoginPage onLogin={(u) => { setUser(u); setPage("workshop_types"); }} setPage={navigate} />;
      case "register":
        return <RegisterPage setPage={navigate} />;
      default:
        return <WorkshopTypeListPage user={user} setPage={navigate} setSelectedWorkshopType={setSelectedWorkshopType} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} page={page} setPage={navigate} onLogout={() => { setUser(null); setPage("workshop_types"); }} />
      <main className="flex-1 pt-14">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}