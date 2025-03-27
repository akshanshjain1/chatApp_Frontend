import axios from "axios";
import { motion } from "framer-motion";
import { Cpu, File, PhoneCall, ShieldCheck, Users } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTwitterSquare,
} from "react-icons/fa";
import ReactFlow, { Background, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const CustomNode = ({ data }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 ${data.feature.bg} rounded-lg shadow-lg text-white max-w-xs`}
    >
      <div className="flex items-center gap-3 mb-3">{data.feature.icon}</div>
      <h3 className="text-lg font-bold">{data.feature.title}</h3>
      <p className="text-sm">{data.feature.description}</p>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </motion.div>
  );
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);
  const [decryptedText, setDecryptedText] = useState("");
  const originalText = "ChatKaro";
  const [randomCipher, setRandomCipher] = useState("");
  const [beamVisible, setBeamVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const isMobile = window.innerWidth < 768; // Check if screen width is less than 768px

  const features = [
    {
      title: "End-to-End Encryption",
      description: "Every message is securely encrypted to ensure privacy.",
      icon: <ShieldCheck size={32} />,
      bg: "bg-gradient-to-r from-blue-500 to-blue-700",
      id: "1",
    },
    {
      title: "Audio & Video Calls",
      description: "Stay connected with clear calls anytime, anywhere.",
      icon: <PhoneCall size={32} />,
      bg: "bg-gradient-to-r from-green-500 to-green-700",
      id: "2",
    },
    {
      title: "File Sharing",
      description: "Share photos, documents, and videos instantly.",
      icon: <File size={32} />,
      bg: "bg-gradient-to-r from-purple-500 to-purple-700",
      id: "3",
    },
    {
      title: "Connect to Friends",
      description: "Easily find and connect with friends on ChatKaro.",
      icon: <Users size={32} />,
      bg: "bg-gradient-to-r from-yellow-500 to-yellow-700",
      id: "4",
    },
    {
      title: "AI-Powered Assistance",
      description: "Get smart suggestions and automated responses with AI.",
      icon: <Cpu size={32} />, // Assuming `Cpu` icon represents AI
      bg: "bg-gradient-to-r from-red-500 to-red-700",
      id: "5",
    },
  ];

  const nodes = features.map((feature, index) => ({
    id: feature.id,
    position: {
      x: isMobile ? 400 : index % 2 === 0 ? 200 : 800,
      y: index * 250,
    },
    data: { feature },
    type: "customNode",
  }));

  const edges = [
    { id: "1-2", source: "1", target: "2", animated: true },
    { id: "2-3", source: "2", target: "3", animated: true },
    { id: "3-4", source: "3", target: "4", animated: true },
    { id: "4-5", source: "4", target: "5", animated: true },
  ];
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
        setDecryptedText("");
        setBeamVisible(false);
      }

      const newOpacity = Math.max(1 - scrollY / 200, 0);
      setOpacity(newOpacity);
      setScale(Math.max(1 - scrollY / 400, 0.8));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showNavbar) {
      setTimeout(() => {
        setBeamVisible(true);
        setRandomCipher(generateRandomCipher(originalText.length));
        decryptText(originalText);
      }, 500);
    }
  }, [showNavbar]);

  const generateRandomCipher = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!";
    return Array.from({ length })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
  };

  const decryptText = (text) => {
    let currentText = randomCipher;
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        currentText =
          currentText.substring(0, index) +
          text[index] +
          currentText.substring(index + 1);
        setDecryptedText(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 120);
  };
  const getNodePosition = (index, isButton = false) => {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 425;
    let boxWidth = isMobile
      ? screenWidth * 0.2
      : screenWidth <= 768
      ? 200
      : 300;

    const navbarHeight = window.innerHeight * 0.9;
    const xCenter = screenWidth / 2 - boxWidth / 2;
    const spacingY = isMobile
      ? window.innerHeight * 0.41
      : screenWidth <= 768
      ? window.innerHeight * 0.3
      : window.innerHeight * 0.35; // Reduce spacing for small screens

    return {
      x: isMobile
        ? xCenter
        : index % 2 === 0
        ? 150
        : screenWidth - boxWidth - 150,
      y: navbarHeight + index * spacingY,
    };
  };
  const featureSectionRef = useRef(null);

  useEffect(() => {
    if (showNavbar && featureSectionRef.current) {
      featureSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showNavbar]);
  return (
    <div className="relative">
      <nav
        className={`fixed top-0 left-0 w-full px-[3%] py-[1%] flex items-center justify-between transition-all duration-500 h-[13%] md:h-[10%] z-50 ${
          showNavbar
            ? "bg-opacity-50 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="relative flex items-center">
          {beamVisible && (
            <div className="absolute left-0 top-1/2 h-1 w-36 bg-blue-500 blur-lg animate-lightBeam"></div>
          )}
          <h1
            className={`text-[1.3rem] md:text-[1.6rem]  font-mono tracking-wide text-blue-500 ${
              showNavbar ? "opacity-100" : "opacity-0"
            }`}
          >
            {decryptedText}
          </h1>
        </div>
        <button
          className="px-6 py-[1.4%] h-[60%] md:h-full lg:h-[70%] border-transparent cursor-pointer text-sm sm:text-sm md:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-all text-center flex justify-center items-center"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

      <div className="overflow-hidden h-[90%]">
        {/* Hero Section */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
          </div>

          {/* Floating & Animated SVGs */}
          <svg
            className="absolute opacity-10 top-12 left-10 w-32 h-32 animate-float"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
          </svg>

          <svg
            className="absolute opacity-10 bottom-8 right-12 w-40 h-40 animate-spin-slow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14"></path>
          </svg>

          {/* Wave Divider */}
          <svg
            className="absolute bottom-0 left-0 w-full h-20 opacity-25"
            viewBox="0 0 1440 320"
            fill="none"
          >
            <path
              fill="#fff"
              fillOpacity="0.1"
              d="M0,256L48,229.3C96,203,192,149,288,138.7C384,128,480,160,576,170.7C672,181,768,171,864,186.7C960,203,1056,245,1152,250.7C1248,256,1344,224,1392,208L1440,192L1440,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Hero Section */}
        <section
          className="relative flex flex-col justify-center items-center min-h-screen text-center px-4 transition-all duration-700"
          style={{ opacity, transform: `scale(${scale})` }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white relative z-10">
            Welcome to <span className="text-blue-300">ChatKaro</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mt-4 max-w-2xl text-white relative z-10">
            Stay connected with your friends, family, and colleagues with ease
            and security.
          </p>
        </section>

        {/* Feature Section */}
        <div
          ref={featureSectionRef}
          className="relative w-full flex flex-col items-center bg-gray-900 py-16 px-6 sm:px-12"
        >
          {/* WhatsApp-like Background */}
          <div className="absolute inset-0 bg-[url('/chat-pattern.png')] opacity-10"></div>

          {/* Floating SVGs for a dynamic look */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute opacity-10 top-8 left-12 w-32 h-32 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a7 7 0 0 1 7 7v4h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2V8a7 7 0 0 1 7-7z"></path>
            </svg>

            <svg
              className="absolute opacity-10 bottom-8 right-12 w-40 h-40 animate-spin-slow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14"></path>
            </svg>

            <svg
              className="absolute opacity-5 top-1/3 left-1/4 w-48 h-48 animate-float"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3h18v18H3z"></path>
            </svg>

            <svg
              className="absolute opacity-10 bottom-12 left-6 w-24 h-24 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4"></path>
            </svg>

            <svg
              className="absolute opacity-5 top-20 right-1/3 w-32 h-32 animate-fadeInOut"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16v16H4z"></path>
            </svg>
          </div>

          {/* Feature Section Content */}
          <div className="relative text-center mb-12 px-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-amber-200 leading-tight tracking-wide font-sans">
              Secure & Reliable Chat
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mt-4 text-lg sm:text-xl font-light leading-relaxed font-[Roboto]">
              Your conversations are{" "}
              <span className="text-green-400 font-medium">encrypted</span>,
              ensuring privacy and a seamless experience.
            </p>
          </div>

          {/* Feature Graph - Expanded Width */}
          <div className="w-full max-w-[600] h-screen sm:h-[160vh] relative bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 border border-gray-700 flex flex-col items-start justify-start">
            <ReactFlow
              className="flex flex-col justify-start items-start"
              nodes={features.map((feature, index) => ({
                id: feature.id,
                position: getNodePosition(index),
                data: { feature },
                type: "customNode",
              }))}
              edges={edges}
              nodeTypes={{ customNode: CustomNode }}
              fitView
              elementsSelectable={false}
              nodesDraggable={false}
              nodesConnectable={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              panOnDrag={false}
              panOnScroll={false}
              preventScrolling={false}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant="dots" className="hidden" />
            </ReactFlow>
          </div>
          <div className="w-full bg-gray-900 text-center py-16 px-6 sm:px-12">
            <h2 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
              You're Just One Click Away from Exploring these!
            </h2>
            <p className="text-slate-50 max-w-2xl mx-auto mt-4 text-lg sm:text-xl leading-relaxed font-medium tracking-wide">
              <span className="text-white font-semibold">
                Experience secure and seamless communication
              </span>{" "}
              like never before.
            </p>

            {/* Get Started Button */}
            <button
              className="relative z-10 mt-6 px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>

        <footer className="w-full bg-gray-900/80 backdrop-blur-md text-gray-300 py-8 px-6 sm:px-12 relative">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between items-start md:items-start text-center md:text-left gap-8">
            {/* Branding */}
            <div className="text-white flex flex-col items-center w-full md:w-auto">
              <h3 className="text-2xl font-extrabold tracking-wide">
                ChatKaro
              </h3>
              <p className="text-sm text-gray-400 mt-2 text-nowrap">
                Elevate Your Conversations.
              </p>
            </div>

            {/* Navigation Links - Grid Layout for Small Screens */}
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex flex-wrap justify-between gap-6">
              {[
                {
                  title: "Products",
                  links: [
                    {
                      name: "VideoShare",
                      link: "https://video-share-rho.vercel.app",
                    },
                    {
                      name: "Emotion Detection",
                      link: "https://emotiondetectionpro.up.railway.app",
                    },
                    { name: "ChatKaro", link: "#" },
                  ],
                },
                {
                  title: "Features",
                  links: [
                    "End-to-End Encryption",
                    "Audio & Video Calls",
                    "File Sharing",
                    "AI Integration",
                  ],
                },
                {
                  title: "Company",
                  links: ["About Us", "Careers", "Blog", "Press"],
                },
                {
                  title: "Support",
                  links: [
                    "Help Center",
                    "Contact Us",
                    "Privacy Policy",
                    "Terms of Service",
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="text-gray-400">
                  <h4 className="text-white font-semibold text-lg mb-3">
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.link ? link.link : "#"}
                          className="hover:text-white text-sm transition-all duration-300"
                        >
                          {link.name ? link.name : link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Social Media Icons */}
            <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row items-center sm:items-end gap-4 w-full md:w-auto">
              <div className="flex gap-5">
                {[
                  { icon: <FaFacebook />, color: "text-blue-500" },
                  { icon: <FaTwitterSquare />, color: "text-blue-400" },
                  { icon: <FaInstagram />, color: "text-pink-500" },
                  { icon: <FaLinkedinIn />, color: "text-blue-600" },
                ].map(({ icon, color }, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`text-gray-400 text-2xl transition-all duration-300 hover:${color} hover:scale-110`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-800 pt-6">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-cyan-400 font-semibold">ChatKaro</span>. All
            Rights Reserved.
          </div>
        </footer>
      </div>
    </div>
  );

  // return(
  // <Container component={"main"} maxWidth="xs" sx={{display:'flex' , flexDirection:'column',alignItems:'center',justifyContent:"center",height:"100vh"}} height="100vh">
  //     <Paper elevation={3} sx={{padding:4, display:'flex',flexDirection:'column',alignItems:'center'}}>
  //         {(

  //             <>
  //             <Typography variant="hs">Login</Typography>
  //             <form onSubmit={handleLogin} >
  //                 <TextField
  //                 required
  //                 fullWidth
  //                 label="username"
  //                 margin="normal"
  //                 variant="outlined"
  //                 value={username.value}
  //                 onChange={username.changeHandler}/>
  //                 <TextField
  //                 required
  //                 fullWidth
  //                 label="password"
  //                 type="password"
  //                 margin="normal"
  //                 variant="outlined"
  //                 value={password.value}
  //                 onChange={password.changeHandler}/>

  //                 <Button variant="contained" color="primary" type="submit" sx={{marginTop:'1rem',textAlign:"center" }} fullWidth disabled={isloading}>
  //                 {
  //                     isloading?("Logging in"):("Log in")
  //                 }
  //                 </Button>
  //                 <Typography textAlign="center"  marginTop={`1rem`}>Or</Typography>
  //                 <Button sx={{marginTop:'1rem'}} fullWidth variant="text"  onClick={()=>navigate("/signup")} disabled={isloading}>Sign up</Button>
  //             </form>
  //             </>

  //         )}

  //     </Paper>
  // </Container>)
}
export default HomePage;
