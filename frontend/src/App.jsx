// ✅ Final App.jsx (Frontend for CV Generator with Prompt → HTML Resume → Preview & Download)

import { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    summary: "",
    role: "",
    experience: "",
    education: "",
    prof_education: "",
    skills: "",
    projects: "",
    awards: "",
    start: "",
    end: "",
    photo: null
  });

  const [previewHTML, setPreviewHTML] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const processListFields = (data) => {
    const copy = { ...data };
    ["skills", "projects", "awards", "education", "experience"].forEach((field) => {
      if (copy[field]) {
        const items = copy[field]
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
        copy[field] = `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      }
    });
    return copy;
  };

  const handleGeneratePreview = async () => {
    const payload = new FormData();
    const file = formData.photo;

    const processedFields = processListFields(formData);

    if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const processed = { ...processedFields, PHOTO_URL: base64Image };
        Object.entries(processed).forEach(([key, val]) => {
          if (key !== "photo") payload.append(key, val);
        });

        setLoading(true);
        try {
          const res = await axios.post("http://localhost:5000/generate-preview", payload);
          setPreviewHTML(res.data.html);
        } catch (err) {
          alert("Failed to generate preview");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDownload = async (format) => {
  const endpoint = format === "pdf" ? "download-pdf" : "download-docx";
  const filename = format === "pdf" ? "resume.pdf" : "resume.docx";

  const payload = new FormData();

  if (format === "pdf") {
    payload.append("html", previewHTML); // 👈 send rendered HTML
  } else {
    const processed = processListFields(formData);
    Object.entries(processed).forEach(([key, val]) => payload.append(key, val));
  }

  try {
    const res = await axios.post(`http://localhost:5000/${endpoint}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    alert("Download failed");
  }
};


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
        <h1 className="text-3xl font-bold">📝 CV Generator</h1>
      </nav>

      <div className="flex flex-col lg:flex-row p-6 gap-8">
        {/* Left Panel: Form */}
        <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Enter Your Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(formData).filter(key => key !== "photo" && key !== "summary").map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-700 font-medium tracking-wide uppercase">{key}</label>
                <input
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={`Enter ${key}`}
                    className="
                    border border-blue-400
                    text-gray-800 
                    bg-white 
                    rounded-md 
                    px-3 py-2
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-300 
                    focus:border-blue-600 shadow-xl 
                    placeholder:text-gray-400
                    "
  
                  // name={key}
                  // value={formData[key]}
                  // onChange={handleChange}
                  // className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            ))}
            <div className="col-span-1 sm:col-span-2 flex flex-col">
              <label className="text-sm text-gray-700 font-medium">Upload Profile Photo</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-6 text-center space-x-4">
            <button
              onClick={handleGeneratePreview}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              🚀 {loading ? "Generating..." : "Generate & Preview"}
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              📄 Download PDF
            </button>
            <button
              onClick={() => handleDownload("docx")}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
            >
              📥 Download DOCX
            </button>
          </div>
        </div>

        {/* Right Panel: HTML Preview */}
        <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700 text-center">Live Resume Preview</h2>
          <div
            className="border p-4 bg-gray-50 max-h-[700px] overflow-y-auto prose"
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;



// // ✅ Final App.jsx (Frontend for CV Generator with Prompt → HTML Resume → Preview & Download)

// import { useState } from "react";
// import axios from "axios";

// function App() {
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     email: "",
//     phone: "",
//     summary: "",
//     role: "",
//     experience: "",
//     education: "",
//     prof_education: "",
//     skills: "",
//     projects: "",
//     awards: "",
//     start: "",
//     end: "",
//     photo: null
//   });

//   const [previewHTML, setPreviewHTML] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value
//     });
//   };

//   const processListFields = (data) => {
//     const copy = { ...data };
//     // Convert comma-separated strings to <li> elements
//     ["skills", "projects", "awards", "education", "experience"].forEach((field) => {
//       if (copy[field]) {
//         const items = copy[field]
//           .split(",")
//           .map((item) => item.trim())
//           .filter((item) => item.length > 0);
//         copy[field] = `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
//       }
//     });
//     return copy;
//   };

//   const handleGeneratePreview = async () => {
//   const payload = new FormData();
//   const file = formData.photo;

//   if (file && file instanceof File) {
//     const reader = new FileReader();
//     reader.onloadend = async () => {
//       const base64Image = reader.result; // data:image/jpeg;base64,...

//       const processed = { ...formData, PHOTO_URL: base64Image };
//       Object.entries(processed).forEach(([key, val]) => {
//         if (key !== "photo") payload.append(key, val); // skip raw photo
//       });

//       setLoading(true);
//       try {
//         const res = await axios.post("http://localhost:5000/generate-preview", payload);
//         setPreviewHTML(res.data.html);
//       } catch (err) {
//         alert("Failed to generate preview");
//       } finally {
//         setLoading(false);
//       }
//     };
//     reader.readAsDataURL(file); // 👈 convert photo to base64
//   }
// };


//   const handleDownload = async (format) => {
//     const endpoint = format === "pdf" ? "download-pdf" : "download-docx";
//     const filename = format === "pdf" ? "resume.pdf" : "resume.docx";

//     const payload = new FormData();
//     const processed = processListFields(formData);
//     Object.entries(processed).forEach(([key, val]) => payload.append(key, val));

//     try {
//       const res = await axios.post(`http://localhost:5000/${endpoint}`, payload, {
//         headers: { "Content-Type": "multipart/form-data" },
//         responseType: "blob"
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       alert("Download failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
//       <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
//         <h1 className="text-3xl font-bold">📝 CV Generator</h1>
//       </nav>

//       <div className="flex flex-col lg:flex-row p-6 gap-8">
//         {/* Left Panel: Form */}
//         <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4 text-blue-700">Enter Your Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {Object.keys(formData).filter(key => key !== "photo" && key !== "summary").map((key) => (
//               <div key={key} className="flex flex-col">
//                 <label className="text-sm text-gray-700 font-medium">{key}</label>
//                 <input
//                   name={key}
//                   value={formData[key]}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-md px-3 py-2"
//                 />
//               </div>
//             ))}
//             <div className="col-span-1 sm:col-span-2 flex flex-col">
//               <label className="text-sm text-gray-700 font-medium">Upload Profile Photo</label>
//               <input
//                 type="file"
//                 name="photo"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded-md px-3 py-2"
//               />
//             </div>
//           </div>
//           <div className="mt-6 text-center space-x-4">
//             <button
//               onClick={handleGeneratePreview}
//               className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//               disabled={loading}
//             >
//               🚀 {loading ? "Generating..." : "Generate & Preview"}
//             </button>
//             <button
//               onClick={() => handleDownload("pdf")}
//               className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
//             >
//               📄 Download PDF
//             </button>
//             <button
//               onClick={() => handleDownload("docx")}
//               className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
//             >
//               📥 Download DOCX
//             </button>
//           </div>
//         </div>

//         {/* Right Panel: HTML Preview */}
//         <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4 text-green-700 text-center">Live Resume Preview</h2>
//           <div
//             className="border p-4 bg-gray-50 max-h-[700px] overflow-y-auto prose"
//             dangerouslySetInnerHTML={{ __html: previewHTML }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;





// import { useState } from "react";
// import axios from "axios";

// function App() {
//   const [formData, setFormData] = useState({
//     name: "",
//     role: "",
//     email: "",
//     phone: "",
//     address: "",
//     summary: "",
//     education: "",
//     experience: "",
//     skills: "",
//     projects: "",
//     awards: ""
//   });

//   const [generatedCV, setGeneratedCV] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleGenerate = async () => {
//     const payload = {
//       name: formData.name,
//       role: formData.role,
//       email: formData.email,
//       phone: formData.phone,
//       address: formData.address,
//       summary: formData.summary,
//       experience: formData.experience.split(",").map(ex => ex.trim()),
//       skills: formData.skills.split(",").map(s => s.trim()),
//       education: formData.education,
//       projects: formData.projects.split(",").map(p => p.trim()),
//       awards: formData.awards.split(",").map(a => a.trim())
//     };

//     try {
//       const response = await axios.post("http://localhost:5000/generate-cv", payload);
//       setGeneratedCV(response.data.resume);
//     } catch (error) {
//       console.error("Error generating CV:", error);
//       alert("Error generating CV. Check backend logs.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
//       <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
//         <h1 className="text-3xl font-bold">📝 CV Generator</h1>
//       </nav>

//       <div className="flex flex-col lg:flex-row p-6 gap-8">
//         {/* Left Panel: Form */}
//         <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4 text-blue-700">Enter Your Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {[
//               ["name", "Name"],
//               ["role", "Role"],
//               ["email", "Email"],
//               ["phone", "Phone"],
//               ["address", "Address"],
//               ["education", "Education"],
//               ["experience", "Experience (comma-separated)"],
//               ["skills", "Skills (comma-separated)"],
//               ["projects", "Projects (comma-separated)"],
//               ["awards", "Awards (comma-separated)"]
//             ].map(([key, label]) => (
//               <div key={key} className="flex flex-col">
//                 <label className="text-sm text-gray-700 font-medium">{label}</label>
//                 <input
//                   name={key}
//                   value={formData[key]}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//             ))}
//             <div className="col-span-1 sm:col-span-2 flex flex-col">
//               <label className="text-sm text-gray-700 font-medium">Professional Summary</label>
//               <textarea
//                 name="summary"
//                 value={formData.summary}
//                 onChange={handleChange}
//                 rows={3}
//                 className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>

//           <div className="mt-6 text-center">
//             <button
//               onClick={handleGenerate}
//               className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//             >
//               🚀 Generate CV
//             </button>
//           </div>
//         </div>

        
                
//              {/* Output Section */}
//         <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4 text-green-700 text-center">Generated CV</h2>

//           <div className="border border-gray-300 p-4 rounded-md h-[500px] overflow-y-auto bg-white text-gray-900 text-sm leading-relaxed">
//             {generatedCV ? (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <h1 className="text-2xl font-bold">{formData.name}</h1>
//                   <p className="text-base italic text-gray-600">{formData.role}</p>
//                   <p className="text-sm text-gray-600">{formData.email} | {formData.phone}</p>
//                   <p className="text-sm text-gray-600">{formData.address}</p>
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-medium text-blue-700 border-b pb-1">Summary</h2>
//                   <p><strong>{formData.summary}</strong></p>
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-medium text-blue-700 border-b pb-1">Education</h2>
//                   <p><strong>{formData.education}</strong></p>
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-medium text-blue-700 border-b pb-1">Experience</h2>
//                   <ul className="list-disc list-inside grid grid-cols-2">
//                     {formData.experience.split(',').map((experience, i) => (
//                       <li key={i}><strong>{experience.trim()}</strong></li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-medium text-blue-700 border-b pb-1">Skills</h2>
//                   <ul className="list-disc list-inside grid grid-cols-2">
//                     {formData.skills.split(',').map((skill, i) => (
//                       <li key={i}><strong>{skill.trim()}</strong></li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-medium text-blue-700 border-b pb-1">Projects</h2>
//                   <ul className="list-disc list-inside">
//                     {formData.projects.split(',').map((project, i) => (
//                       <li key={i}><strong>{project.trim()}</strong></li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-medium text-blue-700 border-b pb-1">Awards</h2>
//                   <ul className="list-disc list-inside">
//                     {formData.awards.split(',').map((award, i) => (
//                       <li key={i}><strong>{award.trim()}</strong></li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-500 italic">Your CV will appear here after generation.</p>
//             )}
//           </div>

//           {generatedCV && (
//               <div className="text-center mt-4">
//                 <button
//                   onClick={async () => {
//                     const payload = {
//                       name: formData.name,
//                       role: formData.role,
//                       email: formData.email,
//                       phone: formData.phone,
//                       address: formData.address,
//                       summary: formData.summary,
//                       experience: formData.experience.split(",").map(ex => ex.trim()),
//                       skills: formData.skills.split(",").map(s => s.trim()),
//                       education: formData.education,
//                       projects: formData.projects.split(",").map(p => p.trim()),
//                       awards: formData.awards.split(",").map(a => a.trim())
//                     };

//                   try {
//                     const res = await axios.post("http://localhost:5000/generate-cv", payload, {
//                     responseType: "blob"
//                   });
//           const url = window.URL.createObjectURL(new Blob([res.data]));
//           const link = document.createElement("a");
//           link.href = url;
//           link.setAttribute("download", "resume.pdf");
//           document.body.appendChild(link);
//           link.click();
//         } catch (error) {
//           alert("Failed to download PDF");
//         }
//       }}
//       className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
//     >
//       📥 Download as PDF
//     </button>
//   </div>
// )}

//         </div>
//       </div> 
//     </div>
//   );
// }

// export default App;


// import { useState } from "react";

// function App() {
//   const [formData, setFormData] = useState({
//     name: "",
//     role: "",
//     email: "",
//     phone: "",
//     address: "",
//     summary: "",
//     education: "",
//     experience: "",
//     skills: "",
//     projects: "",
//     awards: ""
//   });

//   const [generatedCV, setGeneratedCV] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleGenerate = async () => {
//     const payload = {
//       name: formData.name,
//       role: formData.role,
//       email: formData.email,
//       phone: formData.phone,
//       experience: formData.experience,
//       skills: formData.skills.split(",").map(s => s.trim()),
//       education: formData.education,
//       projects: formData.projects.split(",").map(p => p.trim()),
//       awards: formData.awards.split(",").map(a => a.trim())
//     };

//     try {
//       const response = await fetch("http://localhost:5000/generate-cv", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       const data = await response.json();
//       setGeneratedCV(data.resume);
//     } catch (error) {
//       console.error("Error generating CV:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
//         <h1 className="text-2xl font-bold">CV Generator</h1>
//       </nav>

//       <div className="flex flex-col md:flex-row p-6 gap-6">
//         <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
//           <div className="grid grid-cols-2 gap-4">
//             <label>Name:</label>
//             <input name="name" value={formData.name} onChange={handleChange} className="input-field" />

//             <label>Role:</label>
//             <input name="role" value={formData.role} onChange={handleChange} className="input-field" />

//             <label>Email:</label>
//             <input name="email" value={formData.email} onChange={handleChange} className="input-field" />

//             <label>Phone:</label>
//             <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" />

//             <label>Address:</label>
//             <input name="address" value={formData.address} onChange={handleChange} className="input-field" />

//             <label>Summary:</label>
//             <textarea name="summary" value={formData.summary} onChange={handleChange} className="input-field col-span-1" />

//             <label>Education:</label>
//             <input name="education" value={formData.education} onChange={handleChange} className="input-field" />

//             <label>Experience:</label>
//             <input name="experience" value={formData.experience} onChange={handleChange} className="input-field" />

//             <label>Skills:</label>
//             <input name="skills" value={formData.skills} onChange={handleChange} className="input-field" placeholder="e.g. Python, React" />

//             <label>Projects:</label>
//             <input name="projects" value={formData.projects} onChange={handleChange} className="input-field" placeholder="e.g. Chatbot, Portfolio" />

//             <label>Awards:</label>
//             <input name="awards" value={formData.awards} onChange={handleChange} className="input-field" placeholder="e.g. Best Intern" />
//           </div>

//           <div className="mt-4 text-center">
//             <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Generate</button>
//           </div>
//         </div>

//         <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-bold mb-4 text-center">Generated CV</h2>
//           <div className="border border-gray-300 p-4 h-[500px] overflow-y-auto whitespace-pre-wrap">
//             {generatedCV || <p className="text-gray-500 italic">Your CV will appear here after generation.</p>}
//           </div>

//           <div className="text-center mt-4">
//             <button
//               onClick={() => {
//                 const blob = new Blob([generatedCV], { type: "text/plain;charset=utf-8" });
//                 const url = window.URL.createObjectURL(blob);
//                 const link = document.createElement("a");
//                 link.href = url;
//                 link.download = "cv.txt";
//                 link.click();
//               }}
//               className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               DOWNLOAD
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;





// src/App.jsx
// function App() {
//     return (
//      <>
//         <Router>
//           <main className="w-full min-h-screen flex flex-col bg-neutral-50 text-neutral-600">
//              <Navbar />
//           </main>
//         </Router>
//       </>
//     )

  
// }


// export default App;


      // const [name, setName] = useState('');
  // const [education, setEducation] = useState('');
  // const [skills, setSkills] = useState('');
  // const [experience, setExperience] = useState('');
  // const [role, setRole] = useState('');
  // const [phone, setPhone] = useState('');
  // const [email, setEmail] = useState('');
  // const [address, setAddress] = useState('');
  // const [summary, setSummary] = useState('');
  // const [projects, setProjects] = useState('');
  // const [awards, setAwards] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = {
  //     name, role, email, phone, address, summary,
  //     education, experience, skills, projects, awards
  //   };

  //   try {
  //     const res = await axios.post("http://127.0.0.1:5000/generate-cv", data);
  //     console.log("✅ CV Generated:\n", res.data.resume);
  //     alert("CV Generated! Check browser console.");
  //   } catch (err) {
  //     console.error("Error:", err);
  //     alert("Something went wrong.");
  //   }
  // };

  // return (
  //   <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(to bottom, #f5eff9, rgb(185, 230, 194))' }}>
  //     <div className="bg-white p-4 rounded w-75">
  //       <h2 className="text-center mb-4">CV Generator</h2>
  //       <form onSubmit={handleSubmit}>
  //         <div className="mb-3"><input placeholder="Name" className="form-control" onChange={e => setName(e.target.value)} required /></div>
  //         <div className="mb-3"><input placeholder="Role" className="form-control" onChange={e => setRole(e.target.value)} required /></div>
  //         <div className="mb-3"><input placeholder="Email" className="form-control" onChange={e => setEmail(e.target.value)} required /></div>
  //         <div className="mb-3"><input placeholder="Phone" className="form-control" onChange={e => setPhone(e.target.value)} required /></div>
  //         <div className="mb-3"><input placeholder="Address" className="form-control" onChange={e => setAddress(e.target.value)} required /></div>
  //         <div className="mb-3"><textarea placeholder="Summary" className="form-control" onChange={e => setSummary(e.target.value)} required /></div>
  //         <div className="mb-3"><textarea placeholder="Education" className="form-control" onChange={e => setEducation(e.target.value)} required /></div>
  //         <div className="mb-3"><textarea placeholder="Experience" className="form-control" onChange={e => setExperience(e.target.value)} required /></div>
  //         <div className="mb-3"><input placeholder="Skills" className="form-control" onChange={e => setSkills(e.target.value)} required /></div>
  //         <div className="mb-3"><textarea placeholder="Projects" className="form-control" onChange={e => setProjects(e.target.value)} required /></div>
  //         <div className="mb-3"><input placeholder="Awards" className="form-control" onChange={e => setAwards(e.target.value)} required /></div>
  //         <button type="submit" className="btn btn-success w-100">Generate CV</button>
  //       </form>
  //     </div>
  //   </div>
  // );



// import React, { useState } from "react";

// function App() {
//   const [formData, setFormData] = useState({
//     name: "", role: "", email: "", phone: "", address: "", summary: "",
//     education: "", experience: "", skills: "", projects: "", awards: ""
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleGenerate = () => {
//     // Call backend to generate CV
//     console.log("Generating CV with:", formData);
//   };

//   return (
//     <div className="flex p-8 h-screen gap-8">
//       {/* Left: Form */}
//       <div className="w-1/3 space-y-2">
//         {[
//           "name", "role", "email", "phone", "address",
//           "summary", "education", "experience",
//           "skills", "projects", "awards"
//         ].map((field) => (
//           <div key={field}>
//             <label className="block font-semibold capitalize">{field}:</label>
//             <input
//               type="text"
//               name={field}
//               value={formData[field]}
//               onChange={handleChange}
//               className="w-full border border-gray-400 px-2 py-1 rounded"
//             />
//           </div>
//         ))}
//         <button
//           onClick={handleGenerate}
//           className="mt-4 px-4 py-2 border border-black hover:bg-gray-100"
//         >
//           Generate
//         </button>
//       </div>

//       {/* Right: Generated CV */}
//       <div className="flex-1 border border-black flex flex-col justify-center items-center">
//         <p className="text-gray-500">Generated CV</p>
//       </div>

//       {/* Bottom Centered Download Button */}
//       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
//         <button className="px-6 py-2 border border-black hover:bg-gray-100">
//           DOWNLOAD
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;