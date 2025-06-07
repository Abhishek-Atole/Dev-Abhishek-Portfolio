import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js'; // Import Chart.js and registerables

// Register all Chart.js components
Chart.register(...registerables);

// Utility function for wrapping long labels
const wrapLabel = (label: string, maxLen: number = 16): string | string[] => {
    if (label.length <= maxLen) {
        return label;
    }
    const words = label.split(' ');
    let currentLine = '';
    const lines: string[] = [];

    words.forEach(word => {
        if ((currentLine + word).length <= maxLen) {
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine !== '') {
        lines.push(currentLine);
    }
    return lines;
};

// Data for C Build Process Diagram
const cBuildStepsData: { [key: number]: string } = {
    1: "<strong>Source Code (.c):</strong> Your human-readable C program, containing logic and instructions. This is where development begins.",
    2: "<strong>Preprocessor:</strong> First stage of compilation. Handles directives like `#include` (to insert header files) and `#define` (for macro replacements). It removes comments and expands macros. Output: an intermediate file (e.g., `.i`).",
    3: "<strong>Compiler:</strong> Translates the preprocessed intermediate code into assembly language. This language is specific to the CPU architecture but is more readable than machine code. Output: an assembly file (e.g., `.s` or `.asm`).",
    4: "<strong>Assembler:</strong> Converts the assembly code into machine-readable object code. This code is in binary format but is not yet a runnable program as it might contain unresolved references to external libraries. Output: an object file (e.g., `.obj` on Windows, `.o` on Linux).",
    5: "<strong>Linker:</strong> The final stage where one or more object files are combined with necessary code from static or dynamic libraries (e.g., standard C library functions like `printf`). It resolves all external symbol references to produce a single, executable file. It also provides the entry point (e.g., `main` function's address) to the program's primary header. Output: an executable file (e.g., `a.exe` or custom name like `myprogram.exe`).",
    6: "<strong>Executable (.exe):</strong> The complete, runnable program. The operating system's loader moves this file from hard disk to RAM for execution."
};

// Data for Java JVM Diagram
const jvmStepsData: { [key: string]: string } = {
    'Java Source Code': "Your Java program written in human-readable form. This is the starting point for your application.",
    'Java Compiler (javac)': "The Java compiler (javac) translates your `.java` source code into platform-independent Java bytecode.",
    'Java Bytecode': "This is the compiled intermediate code that the JVM executes. It's not machine code but a set of instructions understood by any JVM.",
    'JVM (Java Virtual Machine)': "The JVM is the runtime environment that interprets and executes the Java bytecode. It provides a layer of abstraction between the bytecode and the underlying hardware/OS.",
    'Operating System / Hardware': "The actual physical machine and operating system where the Java application runs. The JVM translates bytecode into native instructions for this specific environment."
};

// Data for Classloader Animation
const classLoaderStageDescriptions: string[] = [
    "The `.class` file containing Java bytecode is the input for the class loading process.",
    "<strong>1. Loading:</strong> The JVM's Classloader Subsystem finds the `.class` file from specified locations (classpath, JARs) and reads its binary data. It creates a `java.lang.Class` object to represent this class in the JVM's Method Area. This involves the delegation model.",
    "<strong>2. Linking:</strong> This phase integrates the class into the JVM's runtime state. It consists of three sub-stages: Verification, Preparation, and Resolution.",
    "<strong>2a. Verification:</strong> The bytecode verifier checks the `.class` file for structural correctness, semantic consistency, and security. It ensures the bytecode adheres to JVM specifications, preventing malicious code or invalid operations. If verification fails, a `java.lang.VerifyError` occurs.",
    "<strong>2b. Preparation:</strong> Memory is allocated for static variables (class variables) defined in the class, and they are initialized to their default values (e.g., 0 for numeric types, null for object references, false for booleans). User-defined initial values are assigned later, during Initialization.",
    "<strong>2c. Resolution:</strong> Symbolic references (e.g., references to other classes, methods, or fields by name) are replaced with direct references (actual memory addresses or pointers). For instance, when your code accesses a `public` method from another class, the JVM resolves its symbolic name to its concrete location in memory. Access modifiers (like `public`, `private`, `protected`) are strictly enforced here. If a class tries to access a symbol it doesn't have permission for, a linkage error (e.g., `java.lang.IllegalAccessError`) is thrown.",
    "<strong>3. Initialization:</strong> This is the final stage of class loading. The JVM executes the class's static initializers and static initialization blocks in the order they appear in the source code. This happens only on the first 'active use' of the class (e.g., creating an instance, invoking a static method).",
    "The class is now fully loaded, linked, and initialized, and ready for your application to use its methods and access its fields."
];

// Reusable components for diagrams to improve modularity and readability

const CBuildProcessDiagram: React.FC = () => {
    const [selectedStep, setSelectedStep] = useState<number | null>(null);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div id="c-build-process-diagram" className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 text-center">
                {[1, 2, 3, 4, 5, 6].map(step => (
                    <React.Fragment key={step}>
                        <div
                            data-step={step}
                            className={`interactive-diagram-item p-4 border-2 border-gray-300 rounded-lg bg-gray-50 w-48 ${selectedStep === step ? 'selected border-indigo-500' : ''}`}
                            onClick={() => setSelectedStep(step)}
                        >
                            {step === 1 && <>Source Code <br/>(.c file)</>}
                            {step === 2 && <>Preprocessor</>}
                            {step === 3 && <>Compiler</>}
                            {step === 4 && <>Assembler</>}
                            {step === 5 && <>Linker</>}
                            {step === 6 && <>Executable <br/>(.exe file)</>}
                        </div>
                        {step < 6 && <div className="font-bold text-2xl text-indigo-500">&rarr;</div>}
                    </React.Fragment>
                ))}
            </div>
            <div id="c-build-process-info" className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 min-h-[100px]">
                {selectedStep ? (
                    <>
                        <h4 className="font-bold mb-2">
                            {selectedStep === 1 && "Source Code (.c)"}
                            {selectedStep === 2 && "Preprocessor"}
                            {selectedStep === 3 && "Compiler"}
                            {selectedStep === 4 && "Assembler"}
                            {selectedStep === 5 && "Linker"}
                            {selectedStep === 6 && "Executable (.exe)"}
                        </h4>
                        <p className="text-indigo-700" dangerouslySetInnerHTML={{ __html: cBuildStepsData[selectedStep] }}></p>
                    </>
                ) : (
                    <p className="text-indigo-800">Click on a step above to see its description.</p>
                )}
            </div>
        </div>
    );
};

const CMemoryManagementDiagram: React.FC = () => {
    const [hoverInfo, setHoverInfo] = useState<string>('');

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="w-full max-w-2xl mx-auto border-4 border-gray-700 rounded-lg p-2 bg-gray-800 text-white flex flex-col justify-between" style={{ minHeight: '400px' }}>
                <div className="text-center font-bold text-xl mb-2">Process Address Space (RAM)</div>
                <div className="flex flex-col flex-grow">
                    <div
                        data-info="Command Line Arguments: Stores parameters passed to the program at execution. Example: Command line arguments for `ls -l`."
                        className="memory-section bg-purple-600 p-2 text-center rounded-t-lg cursor-pointer flex-none"
                        onMouseEnter={() => setHoverInfo("Command Line Arguments: Stores parameters passed to the program at execution. Example: Command line arguments for `ls -l`.")}
                        onMouseLeave={() => setHoverInfo('')}
                    >
                        Command Line Arguments
                    </div>
                    <div className="text-center text-lg text-gray-400 mt-1 mb-1">↑ Low Address</div>
                    <div
                        data-info="Stack: Stores local variables, function parameters, and return addresses. Grows downwards automatically as functions are called and return. Crucial for managing function calls in any language."
                        className="memory-section bg-blue-600 p-4 text-center cursor-pointer flex-grow flex items-center justify-center"
                        onMouseEnter={() => setHoverInfo("Stack: Stores local variables, function parameters, and return addresses. Grows downwards automatically as functions are called and return. Crucial for managing function calls in any language.")}
                        onMouseLeave={() => setHoverInfo('')}
                    >
                        Stack <br/> (Grows Downwards)
                    </div>
                    <div className="text-center text-gray-400 text-sm mt-1 mb-1">~ Potential Gap ~</div>
                    <div
                        data-info="Heap: Region for dynamic memory allocation (e.g., using malloc/free). Managed manually by the programmer. Used for data whose size isn't known at compile time, like user-generated content in social media apps."
                        className="memory-section bg-green-600 p-4 text-center cursor-pointer flex-grow flex items-center justify-center"
                        onMouseEnter={() => setHoverInfo("Heap: Region for dynamic memory allocation (e.g., using malloc/free). Managed manually by the programmer. Used for data whose size isn't known at compile time, like user-generated content in social media apps.")}
                        onMouseLeave={() => setHoverInfo('')}
                    >
                        Heap <br/> (Grows Upwards)
                    </div>
                    <div
                        data-info="Data (BSS): Stores uninitialized global and static variables. Default value is zero. Used for large arrays or objects not given an initial value."
                        className="memory-section bg-yellow-500 text-gray-900 p-3 text-center cursor-pointer flex-none"
                        onMouseEnter={() => setHoverInfo("Data (BSS): Stores uninitialized global and static variables. Default value is zero. Used for large arrays or objects not given an initial value.")}
                        onMouseLeave={() => setHoverInfo('')}
                    >
                        Data (BSS)
                    </div>
                    <div
                        data-info="Data (Initialized): Stores initialized global and static variables. Holds pre-defined application configurations or global state."
                        className="memory-section bg-orange-500 text-gray-900 p-3 text-center cursor-pointer flex-none"
                        onMouseEnter={() => setHoverInfo("Data (Initialized): Stores initialized global and static variables. Holds pre-defined application configurations or global state.")}
                        onMouseLeave={() => setHoverInfo('')}
                    >
                        Data (Initialized)
                    </div>
                    <div
                        data-info="Text (Code): Stores the compiled machine code of the program. This section is read-only and contains the executable instructions of your application."
                        className="memory-section bg-red-600 p-3 text-center rounded-b-lg cursor-pointer flex-none"
                        onMouseEnter={() => setHoverInfo("Text (Code): Stores the compiled machine code of the program. This section is read-only and contains the executable instructions of your application.")}
                        onMouseLeave={() => setHoverInfo('')}
                    >
                        Text (Code)
                    </div>
                    <div className="text-center text-lg text-gray-400 mt-1 mb-1">↓ High Address</div>
                </div>
            </div>
            <div id="c-memory-info" className="mt-4 text-center text-gray-600 font-medium min-h-[24px]">
                {hoverInfo}
            </div>
        </div>
    );
};

const CStructPaddingChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy(); // Destroy previous instance
            }

            chartInstance.current = new Chart(chartRef.current, {
                type: 'doughnut',
                data: {
                    labels: ['char c (1 byte)', 'int i (4 bytes)', 'Padding (3 bytes)'],
                    datasets: [{
                        label: 'Memory Allocation',
                        data: [1, 4, 3],
                        backgroundColor: [
                            'rgb(59, 130, 246)',
                            'rgb(239, 68, 68)',
                            'rgb(161, 161, 170)'
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Struct Demo Memory (Total 8 Bytes)',
                            font: {
                                size: 14
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += context.parsed + ' bytes';
                                    }
                                    return label;
                                },
                                title: function(tooltipItems) {
                                    const item = tooltipItems[0];
                                    let label = item.chart.data.labels[item.dataIndex];
                                    if (Array.isArray(label)) {
                                        return label.join(' ');
                                    } else {
                                        return label;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy(); // Cleanup on component unmount
            }
        };
    }, []);

    return (
        <div className="chart-container mt-4">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

const JavaJVMDiagram: React.FC = () => {
    const [hoverInfo, setHoverInfo] = useState<string>('');

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div id="java-jvm-diagram" className="flex flex-col items-center justify-center space-y-4 text-center">
                {Object.keys(jvmStepsData).map((stepKey, index) => (
                    <React.Fragment key={stepKey}>
                        <div
                            data-info={jvmStepsData[stepKey]}
                            className="interactive-diagram-item p-4 border-2 border-gray-300 rounded-lg bg-gray-50 w-60"
                            onMouseEnter={() => setHoverInfo(jvmStepsData[stepKey])}
                            onMouseLeave={() => setHoverInfo('')}
                        >
                            {stepKey.includes('Source Code') && <>Java Source Code <br/>(.java)</>}
                            {stepKey.includes('Compiler') && <>Java Compiler (javac)</>}
                            {stepKey.includes('Bytecode') && <>Java Bytecode <br/>(.class)</>}
                            {stepKey.includes('JVM') && <>JVM (Java Virtual Machine)</>}
                            {stepKey.includes('Operating System') && <>Operating System / Hardware</>}
                        </div>
                        {index < Object.keys(jvmStepsData).length - 1 && <div className="font-bold text-2xl text-indigo-500">&darr;</div>}
                    </React.Fragment>
                ))}
            </div>
            <div id="java-jvm-info" className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 min-h-[80px]">
                {hoverInfo ? (
                    <p className="text-indigo-700" dangerouslySetInnerHTML={{ __html: hoverInfo }}></p>
                ) : (
                    <p className="text-indigo-800">Hover over the diagram steps to see how Java achieves platform independence.</p>
                )}
            </div>
        </div>
    );
};

const ClassloaderAnimation: React.FC = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const classLoaderStagesRef = useRef<HTMLDivElement[]>([]); // Ref to hold stage divs

    useEffect(() => {
        classLoaderStagesRef.current.forEach((stageDiv, index) => {
            if (stageDiv) {
                if (index <= currentStage) {
                    stageDiv.classList.add('visible');
                } else {
                    stageDiv.classList.remove('visible');
                }
            }
        });
    }, [currentStage]);

    const handleNext = () => {
        if (currentStage < classLoaderStageDescriptions.length - 1) {
            setCurrentStage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStage > 0) {
            setCurrentStage(prev => prev - 1);
        }
    };

    const handleReset = () => {
        setCurrentStage(0);
    };

    return (
        <div className="classloader-diagram-wrapper">
            <h4 className="font-bold text-lg text-indigo-700">Java Class Loading Process</h4>
            <div id="classloader-animation-container" className="mt-4 flex flex-col items-center">
                <div id="stage-0" ref={el => classLoaderStagesRef.current[0] = el!} className="classloader-stage visible">`.class` file (Bytecode)</div>
                <div className="classloader-connector"></div>
                <div id="stage-1" ref={el => classLoaderStagesRef.current[1] = el!} className="classloader-stage">1. Loading</div>
                <div className="classloader-connector"></div>
                <div id="stage-2" ref={el => classLoaderStagesRef.current[2] = el!} className="classloader-stage">2. Linking</div>
                <div className="classloader-connector"></div>
                <div id="stage-3" ref={el => classLoaderStagesRef.current[3] = el!} className="classloader-stage ml-8">2a. Verification</div>
                <div className="classloader-connector"></div>
                <div id="stage-4" ref={el => classLoaderStagesRef.current[4] = el!} className="classloader-stage ml-8">2b. Preparation</div>
                <div className="classloader-connector"></div>
                <div id="stage-5" ref={el => classLoaderStagesRef.current[5] = el!} className="classloader-stage ml-8">2c. Resolution</div>
                <div className="classloader-connector"></div>
                <div id="stage-6" ref={el => classLoaderStagesRef.current[6] = el!} className="classloader-stage">3. Initialization</div>
                <div className="classloader-connector"></div>
                <div id="stage-7" ref={el => classLoaderStagesRef.current[7] = el!} className="classloader-stage">Ready for Execution</div>
            </div>
            <div className="classloader-controls">
                <button onClick={handlePrev} className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition-colors" disabled={currentStage === 0}>Previous Step</button>
                <button onClick={handleNext} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors" disabled={currentStage === classLoaderStageDescriptions.length - 1}>Next Step</button>
                <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">Reset</button>
            </div>
            <div id="classloader-info-box" className="diagram-info-box w-full max-w-lg text-left mt-4">
                <p className="text-indigo-800 text-sm" dangerouslySetInnerHTML={{ __html: classLoaderStageDescriptions[currentStage] }}></p>
            </div>
        </div>
    );
};

const GeminiQASection: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');

    const askGemini = async () => {
        if (!question.trim()) {
            setResponse('<p class="text-red-500">Please enter a question to ask Gemini.</p>');
            return;
        }

        setLoading(true);
        setResponse('');

        try {
            const chatHistory = [{ role: "user", parts: [{ text: question }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will automatically provide the API key
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setResponse(`<p class="whitespace-pre-wrap">${text}</p>`);
            } else {
                setResponse('<p class="text-red-500">Sorry, I could not generate a response. Please try rephrasing your question.</p>');
            }
        } catch (error: any) {
            console.error('Error calling Gemini API:', error);
            setResponse(`<p class="text-red-500">An error occurred while connecting to Gemini. Please try again later. Error: ${error.message}</p>`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="gemini-qa-section" className="bg-indigo-100 p-6 rounded-lg shadow-inner mt-12 space-y-4">
            <h2 className="text-3xl font-bold text-indigo-800">Ask Gemini: Programming Concepts ✨</h2>
            <p className="text-lg text-indigo-700">Have a question about a C, C++, or Java concept? Type it below and let Gemini help clarify!</p>
            <textarea
                id="gemini-question"
                className="w-full p-3 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y min-h-[80px]"
                placeholder="e.g., 'What is the difference between malloc and new in C++?' or 'Explain polymorphism in simple terms.'"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            ></textarea>
            <button
                id="ask-gemini-btn"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                onClick={askGemini}
            >
                Ask Gemini ✨
            </button>
            {loading && (
                <div id="gemini-loading" className="text-indigo-600 font-semibold mt-4">
                    Processing your question...
                </div>
            )}
            {response && (
                <div id="gemini-response" className="mt-4 p-4 bg-white rounded-lg border border-gray-200 text-gray-800 prose prose-indigo max-w-none" dangerouslySetInnerHTML={{ __html: response }}>
                </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
    const [activeSectionId, setActiveSectionId] = useState<string>('overview');
    const [activeLanguage, setActiveLanguage] = useState<string>('c'); // 'c', 'cpp', 'java'

    const handleNavLinkClick = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        setActiveSectionId(targetId);
        window.history.pushState(null, '', `#${targetId}`);
        // Determine the language block based on the clicked section's ID
        if (targetId.startsWith('c-')) setActiveLanguage('c');
        else if (targetId.startsWith('cpp-')) setActiveLanguage('cpp');
        else if (targetId.startsWith('java-')) setActiveLanguage('java');
        else if (targetId === 'overview') setActiveLanguage(''); // No active language tab for overview
    };

    const handleLangTabClick = (lang: string) => {
        setActiveLanguage(lang);
        setActiveSectionId(`${lang}-overview`); // Default to overview of the selected language
        window.history.pushState(null, '', `#${lang}-overview`);
    };

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                setActiveSectionId(hash);
                if (hash.startsWith('c-')) setActiveLanguage('c');
                else if (hash.startsWith('cpp-')) setActiveLanguage('cpp');
                else if (hash.startsWith('java-')) setActiveLanguage('java');
                else if (hash === 'overview') setActiveLanguage('');
            } else {
                setActiveSectionId('overview');
                setActiveLanguage('');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Call once on mount to set initial state from URL

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderContentSection = (id: string, children: React.ReactNode) => (
        <div id={id} className={`content-section space-y-6 ${activeSectionId === id ? 'active' : ''}`}>
            {children}
        </div>
    );

    return (
        <div className="antialiased font-inter">
            {/* Global Styles (similar to original HTML's style block) */}
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f4f5f7;
                    color: #1f2937;
                }
                .content-section {
                    display: none;
                }
                .content-section.active {
                    display: block;
                }
                .nav-link.active {
                    background-color: #e0e7ff;
                    color: #3730a3;
                    font-weight: 600;
                }
                .code-block {
                    background-color: #1e293b;
                    color: #e2e8f0;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    font-family: 'Courier New', Courier, monospace;
                }
                .chart-container {
                    position: relative;
                    width: 100%;
                    max-width: 350px;
                    height: auto;
                    margin-left: auto;
                    margin-right: auto;
                }
                .interactive-diagram-item {
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                }
                .interactive-diagram-item:hover, .interactive-diagram-item.selected {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                    border-color: #6366f1;
                }
                .level-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }
                .level-beginner { background-color: #d1fae5; color: #065f46; }
                .level-intermediate { background-color: #fef08a; color: #854d09; }
                .level-advanced { background-color: #fecaca; color: #991b1b; }

                .diagram-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: #ffffff;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    margin-top: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .diagram-node {
                    background-color: #e0e7ff;
                    color: #3730a3;
                    padding: 0.75rem 1.25rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    text-align: center;
                    margin: 0.5rem 0;
                    border: 1px solid #c7d2fe;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .diagram-arrow {
                    font-size: 1.5rem;
                    color: #60a5fa;
                    margin: 0.25rem 0;
                    font-weight: bold;
                }
                .diagram-line {
                    width: 2px;
                    height: 20px;
                    background-color: #60a5fa;
                    margin: 0 auto;
                }
                .diagram-horizontal-line {
                    width: 80px;
                    height: 2px;
                    background-color: #60a5fa;
                    margin: 0 0.5rem;
                }
                .diagram-flex-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0.5rem 0;
                }
                .diagram-info-box {
                    background-color: #eef2ff;
                    border-left: 4px solid #6366f1;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    color: #4338ca;
                    margin-top: 1rem;
                    min-height: 50px;
                }
                .memory-block {
                    background-color: #fff;
                    border: 1px solid #ccc;
                    padding: 0.5rem;
                    margin: 0.25rem;
                    text-align: center;
                    border-radius: 4px;
                    box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
                    font-size: 0.875rem;
                    min-width: 80px;
                    position: relative;
                }
                .memory-arrow {
                    position: absolute;
                    width: 20px;
                    height: 2px;
                    background-color: #60a5fa;
                    top: 50%;
                    transform: translateY(-50%);
                    left: -20px;
                }
                .memory-value {
                    font-weight: 600;
                    color: #374151;
                }
                .memory-address {
                    font-size: 0.75rem;
                    color: #6b7280;
                    margin-top: 0.25rem;
                }

                .object-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                }
                .object-box {
                    border: 2px solid #60a5fa;
                    border-radius: 8px;
                    padding: 1rem;
                    background-color: #e0e7ff;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .object-arrow {
                    position: absolute;
                    top: 50%;
                    left: 100%;
                    width: 30px;
                    height: 2px;
                    background-color: #60a5fa;
                    transform: translateY(-50%);
                }
                .object-arrow::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: -5px;
                    border-top: 5px solid transparent;
                    border-bottom: 5px solid transparent;
                    border-left: 10px solid #60a5fa;
                }
                .pointer-box {
                    border: 2px solid #ef4444;
                    border-radius: 8px;
                    padding: 1rem;
                    background-color: #fee2e2;
                    text-align: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .pointer-concept-diagram {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    margin-top: 2rem;
                    position: relative;
                }
                .pointer-target-box {
                    border: 2px solid #22c55e;
                    padding: 1rem;
                    border-radius: 8px;
                    background-color: #dcfce7;
                    text-align: center;
                    margin-left: 50px;
                    position: relative;
                    min-width: 120px;
                }
                .pointer-line {
                    position: absolute;
                    background-color: #ef4444;
                    height: 2px;
                    z-index: 10;
                }
                .pointer-line::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: -5px;
                    border-top: 5px solid transparent;
                    border-bottom: 5px solid transparent;
                    border-left: 10px solid #ef4444;
                }

                .language-tabs-container {
                    display: flex;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    overflow-x: auto;
                    white-space: nowrap;
                }
                .lang-tab {
                    padding: 0.75rem 1.25rem;
                    font-weight: 600;
                    color: #6b7280;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    background-color: transparent;
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    margin-right: 0.5rem;
                }
                .lang-tab:hover {
                    color: #4f46e5;
                }
                .lang-tab.active {
                    color: #4f46e5;
                    border-color: #4f46e5;
                    background-color: #ffffff;
                    box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
                }
                .language-content-block {
                    display: none;
                }
                .language-content-block.active {
                    display: block;
                }

                .classloader-stage {
                    background-color: #e0f2fe;
                    border: 2px solid #38b2ac;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin: 0.5rem 0;
                    transition: all 0.4s ease-in-out;
                    opacity: 0;
                    transform: translateY(20px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    position: relative;
                    text-align: center;
                }
                .classloader-stage.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .classloader-connector {
                    width: 2px;
                    height: 20px;
                    background-color: #38b2ac;
                    margin: 0.5rem auto;
                    transition: background-color 0.4s ease-in-out;
                }
                .classloader-diagram-wrapper {
                    background-color: #ffffff;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    margin-top: 1.5rem;
                    margin-bottom: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .classloader-controls {
                    margin-top: 1rem;
                    display: flex;
                    gap: 1rem;
                }
                `}
            </style>

            <div className="flex flex-col md:flex-row min-h-screen">
                <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 md:fixed md:h-full overflow-y-auto">
                    <h1 className="text-xl font-bold text-indigo-700 mb-6">Programming Cheatsheet</h1>
                    <nav id="main-navigation" className="space-y-2">
                        <a href="#overview" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold ${activeSectionId === 'overview' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'overview')}>Overview & Comparison</a>

                        <h3 className="text-sm uppercase text-gray-500 mt-4 mb-1 px-4">C Language</h3>
                        <a href="#c-fundamentals" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-fundamentals' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-fundamentals')}>1. Fundamentals</a>
                        <a href="#c-build-process" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-build-process' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-build-process')}>2. Build Process</a>
                        <a href="#c-data-types" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-data-types' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-data-types')}>3. Data Types</a>
                        <a href="#c-memory-management" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-memory-management' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-memory-management')}>4. Memory Management</a>
                        <a href="#c-pointers" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-pointers' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-pointers')}>5. Pointers</a>
                        <a href="#c-arrays" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-arrays' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-arrays')}>6. Arrays</a>
                        <a href="#c-functions" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-functions' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-functions')}>7. Functions</a>
                        <a href="#c-variables-constants" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-variables-constants' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-variables-constants')}>8. Variables & Constants</a>
                        <a href="#c-structs-unions" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-structs-unions' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-structs-unions')}>9. Structs & Unions</a>
                        <a href="#c-storage-classes" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-storage-classes' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-storage-classes')}>10. Storage Classes</a>
                        <a href="#c-paradigms" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-paradigms' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-paradigms')}>11. Programming Paradigms</a>
                        <a href="#c-io" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-io' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-io')}>12. Basic I/O</a>
                        <a href="#c-declaration" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'c-declaration' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'c-declaration')}>13. Declaration vs Definition</a>

                        <h3 className="text-sm uppercase text-gray-500 mt-4 mb-1 px-4">C++ Language</h3>
                        <a href="#cpp-overview" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'cpp-overview' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'cpp-overview')}>1. Overview & OOP</a>
                        <a href="#cpp-classes-objects" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'cpp-classes-objects' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'cpp-classes-objects')}>2. Classes & Objects</a>
                        <a href="#cpp-inheritance" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'cpp-inheritance' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'cpp-inheritance')}>3. Inheritance</a>
                        <a href="#cpp-polymorphism" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'cpp-polymorphism' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'cpp-polymorphism')}>4. Polymorphism</a>
                        <a href="#cpp-smart-pointers" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'cpp-smart-pointers' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'cpp-smart-pointers')}>5. Smart Pointers</a>
                        <a href="#cpp-stl" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'cpp-stl' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'cpp-stl')}>6. Standard Template Library</a>

                        <h3 className="text-sm uppercase text-gray-500 mt-4 mb-1 px-4">Java Language</h3>
                        <a href="#java-overview" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'java-overview' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'java-overview')}>1. Overview & JVM</a>
                        <a href="#java-oop" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'java-oop' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'java-oop')}>2. OOP in Java</a>
                        <a href="#java-gc" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'java-gc' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'java-gc')}>3. Garbage Collection</a>
                        <a href="#java-concurrency" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'java-concurrency' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'java-concurrency')}>4. Concurrency</a>
                        <a href="#java-ecosystem" className={`nav-link block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${activeSectionId === 'java-ecosystem' ? 'active' : ''}`} onClick={(e) => handleNavLinkClick(e, 'java-ecosystem')}>5. Ecosystem & Use Cases</a>
                    </nav>
                </aside>

                <main className="flex-1 md:ml-64 p-6 md:p-10">
                    <div id="overview" className={`content-section space-y-6 ${activeSectionId === 'overview' ? 'active' : ''}`}>
                        <h2 className="text-3xl font-bold text-gray-800">Overview & Language Comparison</h2>
                        <p className="text-lg text-gray-600">Welcome to this interactive programming cheatsheet, designed for learners from beginner to advanced levels. Here, we delve into the core concepts of C, C++, and Java – three foundational languages that underpin much of modern software development. Explore their unique features, understand their strengths, and see how they are applied in real-world industrial settings, powering the applications you use every day.</p>

                        <h3 className="text-xl font-semibold mb-4">C, C++, Java: A Comparative Glance <span className="level-badge level-beginner">Beginner</span></h3>
                        <p className="text-gray-600 mb-4">This table provides a high-level comparison of C, C++, and Java, highlighting their key characteristics, paradigms, and common use cases. It's a great starting point to understand their fundamental differences and why each language holds a unique place in the software world.</p>
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Feature</th>
                                        <th scope="col" className="px-6 py-3">C</th>
                                        <th scope="col" className="px-6 py-3">C++</th>
                                        <th scope="col" className="px-6 py-3">Java</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">Paradigm</th>
                                        <td className="px-6 py-4">Procedural</td>
                                        <td className="px-6 py-4">Multi-paradigm (Procedural, OOP)</td>
                                        <td className="px-6 py-4">Object-Oriented</td>
                                    </tr>
                                    <tr className="bg-white border-b">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">Memory Mgmt.</th>
                                        <td className="px-6 py-4">Manual (pointers, malloc/free)</td>
                                        <td className="px-6 py-4">Manual (pointers, new/delete) + Smart Pointers</td>
                                        <td className="px-6 py-4">Automatic (Garbage Collector)</td>
                                    </tr>
                                    <tr className="bg-white border-b">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">Platform Independence</th>
                                        <td className="px-6 py-4">No (compiled to specific OS/architecture)</td>
                                        <td className="px-6 py-4">No (compiled to specific OS/architecture)</td>
                                        <td className="px-6 py-4">Yes (via JVM - "Write Once, Run Anywhere")</td>
                                    </tr>
                                    <tr className="bg-white border-b">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">Performance</th>
                                        <td className="px-6 py-4">Very High (close to hardware)</td>
                                        <td className="px-6 py-4">Very High (with OOP overhead)</td>
                                        <td className="px-6 py-4">High (JIT compilation)</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">Typical Use Cases</th>
                                        <td className="px-6 py-4">OS, Embedded Systems, Drivers</td>
                                        <td className="px-6 py-4">Game Dev, High-Performance Systems, Desktop Apps</td>
                                        <td className="px-6 py-4">Enterprise Apps, Android Apps, Web Backend</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Language Tabs */}
                    <div className="language-tabs-container bg-white rounded-t-lg shadow-sm">
                        <button className={`lang-tab ${activeLanguage === 'c' ? 'active' : ''}`} onClick={() => handleLangTabClick('c')}>C Language</button>
                        <button className={`lang-tab ${activeLanguage === 'cpp' ? 'active' : ''}`} onClick={() => handleLangTabClick('cpp')}>C++ Language</button>
                        <button className={`lang-tab ${activeLanguage === 'java' ? 'active' : ''}`} onClick={() => handleLangTabClick('java')}>Java Language</button>
                    </div>

                    {/* C Language Content Block */}
                    <div id="c-content-block" className={`language-content-block ${activeLanguage === 'c' ? 'active' : ''}`}>
                        {renderContentSection('c-fundamentals',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Language Fundamentals <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">This section introduces the foundational aspects of the C language, including its history, core design principles, and standardization journey. Understanding these fundamentals provides context for why C is designed the way it is and its lasting impact on modern computing.</p>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Origin & Purpose</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                                        <li><strong>Origin:</strong> Developed by Dennis Ritchie in 1972 at AT&T Bell Labs.</li>
                                        <li><strong>Influence:</strong> Inspired by BCPL (Basic Combined Programming Language).</li>
                                        <li><strong>Purpose:</strong> Primarily created to develop the "Unics" (later Unix) operating system.</li>
                                        <li className="mt-2"><strong>Industrial Relevance:</strong> C's close-to-hardware nature makes it indispensable for building operating systems (e.g., Linux kernel, Windows core), embedded systems (e.g., in cars, IoT devices), and high-performance computing, which form the bedrock of platforms like Facebook's backend infrastructure and Zomato's low-latency data processing.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Standardization</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                                        <li><strong>K&R (1975):</strong> The original informal standard by Kernighan and Ritchie.</li>
                                        <li><strong>ANSI C (1983 / C89):</strong> The first official standard by the American National Standards Institute.</li>
                                        <li><strong>ISO C (1990):</strong> Adopted by the International Organization for Standardization.</li>
                                        <li><strong>C99 (1999):</strong> A major revision introducing new features.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow"><strong className="text-indigo-600">Procedural:</strong> Organized into functions or procedures.</div>
                                        <div className="bg-white p-4 rounded-lg shadow"><strong className="text-indigo-600">Compiled:</strong> Source code is translated into machine code.</div>
                                        <div className="bg-white p-4 rounded-lg shadow"><strong className="text-indigo-600">Block-Structured:</strong> Uses `{}` for code blocks.</div>
                                        <div className="bg-white p-4 rounded-lg shadow"><strong className="text-indigo-600">Native:</strong> Communicates directly with the OS.</div>
                                        <div className="bg-white p-4 rounded-lg shadow"><strong className="text-indigo-600">Statically Typed:</strong> Data types checked at compile time.</div>
                                        <div className="bg-white p-4 rounded-lg shadow"><strong className="text-indigo-600">General Purpose:</strong> Versatile for various tasks.</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {renderContentSection('c-build-process',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Build Process (Toolchain) <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">Ever wonder what happens when you compile a C program? This section visualizes the toolchain, the sequence of steps that transforms your human-readable source code into a machine-executable file. Click on each step in the diagram below to learn more about its specific role in the process.</p>
                                <CBuildProcessDiagram />
                            </>
                        )}

                        {renderContentSection('c-data-types',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Data Types <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">Data types are the building blocks for storing information in C. They tell the compiler how much memory to allocate and how to interpret the stored values. This section breaks down the three main categories of data types available in C.</p>
                                <div className="diagram-container">
                                    <div className="diagram-node">Data Types in C</div>
                                    <div className="diagram-line"></div>
                                    <div className="diagram-flex-row">
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node">Primitive</div>
                                            <div className="diagram-line"></div>
                                            <div className="flex flex-col items-start text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <span>`int`, `float`, `char`, `double`, `void`</span>
                                                <span className="mt-1">➕ `Boolean` (C++ only)</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node">Derived</div>
                                            <div className="diagram-line"></div>
                                            <div className="flex flex-col items-start text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <span>`Function`, `Array`, `Pointer`</span>
                                                <span className="mt-1">➕ `Reference` (C++ only)</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node">User-Defined</div>
                                            <div className="diagram-line"></div>
                                            <div className="flex flex-col items-start text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <span>`Structure`, `Union`, `Enumeration`</span>
                                                <span className="mt-1">➕ `Class` (C++ only)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Primitive Data Types Explained</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-white p-5 rounded-lg shadow transition hover:shadow-lg">
                                            <h4 className="font-bold text-lg text-indigo-700">char</h4>
                                            <p className="text-gray-600">Stores a single character.</p>
                                            <div className="mt-2 text-sm"><strong>Size:</strong> 1 byte (8 bits)</div>
                                            <div className="mt-1 text-sm"><strong>Range:</strong> -128 to 127 (signed) or 0 to 255 (unsigned)</div>
                                            <div className="code-block text-sm mt-2">'A', 'b', '9'</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-lg shadow transition hover:shadow-lg">
                                            <h4 className="font-bold text-lg text-indigo-700">int</h4>
                                            <p className="text-gray-600">Stores integer (whole) numeric values.</p>
                                            <div className="mt-2 text-sm"><strong>Size:</strong> Typically 4 bytes (can be 2 bytes on older systems)</div>
                                            <div className="mt-1 text-sm"><strong>Range (4-byte):</strong> Approx. -2 billion to +2 billion</div>
                                            <div className="code-block text-sm mt-2">1, 23, -99</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-lg shadow transition hover:shadow-lg">
                                            <h4 className="font-bold text-lg text-indigo-700">float</h4>
                                            <p className="text-gray-600">Stores single-precision floating-point decimal values.</p>
                                            <div className="mt-2 text-sm"><strong>Size:</strong> Typically 4 bytes</div>
                                            <div className="mt-1 text-sm"><strong>Precision:</strong> ~6-7 decimal digits</div>
                                            <div className="code-block text-sm mt-2">99.01f, 40.24f</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-lg shadow transition hover:shadow-lg">
                                            <h4 className="font-bold text-lg text-indigo-700">double</h4>
                                            <p className="text-gray-600">High-precision floating-point decimal values.</p>
                                            <div className="mt-2 text-sm"><strong>Size:</strong> Typically 8 bytes</div>
                                            <div className="mt-1 text-sm"><strong>Precision:</strong> ~15-17 decimal digits</div>
                                            <div className="code-block text-sm mt-2">24.982634</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-lg shadow transition hover:shadow-lg">
                                            <h4 className="font-bold text-lg text-indigo-700">void</h4>
                                            <p className="text-gray-600">Represents the absence of type, used for generic pointers or functions returning no value.</p>
                                            <div className="mt-2 text-sm"><strong>Size:</strong> No memory allocated</div>
                                            <div className="code-block text-sm mt-2">void myFunction();</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-lg shadow transition hover:shadow-lg">
                                            <h4 className="font-bold text-lg text-indigo-700">Boolean (C++ only)</h4>
                                            <p className="text-gray-600">Stores logical values: `true` or `false`.</p>
                                            <div className="mt-2 text-sm"><strong>Size:</strong> 1 byte (in C++, sometimes 1 bit conceptually)</div>
                                            <div className="code-block text-sm mt-2">bool isActive = true;</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Choosing the right data type is fundamental for memory efficiency and performance. In applications like Zomato, optimizing data structures for menu items or user profiles relies heavily on efficient use of primitive types and custom structures. For high-volume transaction systems (like payment gateways), precise control over data representation, often managed by C/C++ data types, is critical. For instance, a `char` array is ideal for short strings (like a food item name), while `double` is used for precise financial calculations.</p>
                            </>
                        )}

                        {renderContentSection('c-memory-management',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Memory Management & Process Address Space <span className="level-badge level-intermediate">Intermediate</span></h2>
                                <p className="text-lg text-gray-600">When a C program runs, the operating system allocates a block of memory for it, called the address space. This space is logically divided into several key sections, each serving a distinct purpose for storing code, variables, and temporary data. Hover over the diagram sections to see their roles.</p>
                                <CMemoryManagementDiagram />
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Deep understanding of memory layout is paramount in performance-critical systems. For Facebook's server infrastructure, LinkedIn's data processing pipelines, or even game development, efficient use of stack vs. heap memory directly impacts speed and stability, preventing issues like memory leaks or crashes. For instance, game assets (textures, models) often reside on the heap, while temporary calculation variables are on the stack.</p>
                            </>
                        )}

                        {renderContentSection('c-pointers',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Pointers <span className="level-badge level-intermediate">Intermediate</span></h2>
                                <p className="text-lg text-gray-600">Pointers are one of C's most powerful and challenging features. A pointer is a special variable that doesn't hold a value itself, but rather stores the memory address of another variable. Mastering pointers is key to efficient memory management, dynamic data structures, and more.</p>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold mb-4">Key Concepts</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <div><strong className="text-indigo-600">Declaration:</strong> `datatype *pointer_name;` <span className="code-block inline-block text-sm ml-2">`int *ptr;`</span></div>
                                            <div><strong className="text-indigo-600">Initialization:</strong> `int *ptr = NULL;` (Best practice to prevent `Segmentation Fault`)</div>
                                            <div><strong className="text-indigo-600">Address-of Operator (`&`):</strong> Used to get the memory address of a variable. <span className="code-block inline-block text-sm ml-2">`ptr = &num;`</span></div>
                                            <div><strong className="text-indigo-600">Dereferencing (`*`):</strong> Used to access the value at the pointer's stored address. <span className="code-block inline-block text-sm ml-2">`*ptr`</span></div>
                                            <div><strong className="text-indigo-600">`NULL` Pointer:</strong> A pointer that does not point to any valid memory location (value is `0`). Using uninitialized pointers leads to `Segmentation Fault`.</div>
                                        </div>
                                        <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg flex-col">
                                            <p className="font-mono text-lg mb-2">Conceptual Pointer Diagram</p>
                                            <div className="pointer-concept-diagram">
                                                <div className="pointer-box">
                                                    <span className="font-bold text-indigo-800">ptr</span> <br />
                                                    <span className="text-gray-600">Addr: 0x100</span> <br />
                                                    <span className="memory-value">Value: 0x500</span>
                                                </div>
                                                <div className="pointer-line" style={{ width: '50px', left: 'calc(100% - 50px)', top: '50%' }}></div>
                                                <div className="pointer-target-box">
                                                    <span className="font-bold text-green-800">num</span> <br />
                                                    <span className="text-gray-600">Addr: 0x500</span> <br />
                                                    <span className="memory-value">Value: 10</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">Here, `ptr` (at address 0x100) holds the address 0x500, which is where `num` (with value 10) is stored.</p>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 mt-8">Pointer Arithmetic <span className="level-badge level-advanced">Advanced</span></h3>
                                    <p className="text-gray-600">Pointers can be incremented or decremented, but this moves them by the size of the data type they point to, not by single bytes. This is crucial for navigating arrays and memory blocks efficiently.</p>
                                    <div className="code-block mt-4">
                                        <div>int arr[] = {'{'}10, 20, 30{'}'}; <span className="text-gray-400">// arr points to the start of the array</span></div>
                                        <div>int *p = arr; <span className="text-gray-400">// p points to arr[0] (value 10)</span></div>
                                        <div>printf("Initial *p: %d\\n", *p); <span className="text-gray-400">// Output: 10</span></div>
                                        <div>p++; <span className="text-gray-400">// p now points to arr[1] (value 20)</span></div>
                                        <div>printf("After p++: %d\\n", *p); <span className="text-gray-400">// Output: 20</span></div>
                                        <div>p = p + 2; <span className="text-gray-400">// p now points to arr[3] (outside bounds, potential error)</span></div>
                                        <div className="mt-2"><strong>Important:</strong> Pointer arithmetic is only valid within array bounds or just one element past the end.</div>
                                    </div>
                                    <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Pointers are fundamental in systems programming, operating systems, and even game engines where direct memory manipulation is needed for extreme performance. For instance, in a high-frequency trading system or a game rendering engine, pointers enable direct access to memory buffers, allowing for zero-copy data operations and fine-grained control over memory layout, essential for real-time responsiveness. `void` pointers are used in generic library functions (like `memcpy` or `qsort`) that operate on arbitrary data types.</p>
                                </div>
                            </>
                        )}

                        {renderContentSection('c-arrays',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Arrays <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">An array is a collection of elements of the same data type stored in contiguous memory locations. It provides an efficient way to store and manage lists of data. In C, arrays and pointers are closely related concepts.</p>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold mb-4">Array & Pointer Relationship</h3>
                                    <p className="mb-4">The name of an array acts as a constant pointer to its first element. This means you can use pointer arithmetic to access array elements.</p>
                                    <div className="code-block">
                                        <div>int arr[3] = {'{'}10, 20, 30{'}'};</div>
                                        <div>// `arr` is equivalent to `&arr[0]` (address of the first element)</div>
                                        <div>// These two lines are equivalent for accessing elements:</div>
                                        <div>int x = arr[1]; <span className="text-gray-400">// Accessing element with index (recommended)</span></div>
                                        <div>int y = *(arr + 1); <span className="text-gray-400">// Accessing element with pointer arithmetic</span></div>
                                        <div className="mt-2">printf("Element at index 1: %d\\n", x);</div>
                                        <div>printf("Element using pointer: %d\\n", y);</div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 mt-8">Memory Representation of an Array</h3>
                                    <div className="diagram-container">
                                        <div className="diagram-flex-row">
                                            <div className="flex flex-col items-center">
                                                <div className="memory-block"><span className="memory-value">10</span></div>
                                                <span className="memory-address">arr[0] @ 0x100</span>
                                            </div>
                                            <div className="diagram-horizontal-line"></div>
                                            <div className="flex flex-col items-center">
                                                <div className="memory-block"><span className="memory-value">20</span></div>
                                                <span className="memory-address">arr[1] @ 0x104</span>
                                            </div>
                                            <div className="diagram-horizontal-line"></div>
                                            <div className="flex flex-col items-center">
                                                <div className="memory-block"><span className="memory-value">30</span></div>
                                                <span className="memory-address">arr[2] @ 0x108</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">Elements are stored contiguously. Each `int` takes 4 bytes. `arr+1` moves 4 bytes from `0x100` to `0x104`.</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Arrays are used everywhere, from storing user IDs in Facebook's database caches to holding pixel data for images on Instagram. Efficient array traversal and manipulation are key to performance in data-intensive applications. For example, processing a list of Zomato restaurants based on filters efficiently relies on optimized array operations. They are the backbone for implementing data structures like stacks, queues, and even hash tables.</p>
                            </>
                        )}

                        {renderContentSection('c-functions',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Functions <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">Functions are the fundamental building blocks of a C program. They are self-contained modules of code that accomplish a specific task. Functions promote code reusability and make programs more organized and manageable.</p>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold mb-4">Function Structure & Flow</h3>
                                    <div className="code-block mb-4">
                                        <div><span className="text-pink-400">void</span> <span className="text-yellow-300">displayMessage</span>() {'{'} <span className="text-gray-400">// Function Definition</span></div>
                                        <div>    printf("Hello from displayMessage!\\n");</div>
                                        <div>{'}'}</div>
                                        <div className="mt-4"><span className="text-pink-400">int</span> <span className="text-yellow-300">main</span>() {'{'} <span className="text-gray-400">// Main Function (Entry Point)</span></div>
                                        <div>    printf("This is the main function.\\n");</div>
                                        <div>    <span className="text-yellow-300">displayMessage</span>(); <span className="text-gray-400">// Function Call</span></div>
                                        <div>    <span className="text-purple-400">return</span> 0; <span className="text-gray-400">// Exit Status to OS</span></div>
                                        <div>{'}'}</div>
                                    </div>
                                    <div className="diagram-container">
                                        <div className="diagram-node">Operating System</div>
                                        <div className="diagram-line"></div>
                                        <div className="diagram-node">`main()` Function (Entry Point)</div>
                                        <div className="diagram-line"></div>
                                        <div className="diagram-node">`displayMessage()` Function Call</div>
                                        <div className="diagram-line diagram-line-up">&uarr; Return</div>
                                        <div className="diagram-node">Continue `main()` Execution</div>
                                        <div className="diagram-line"></div>
                                        <div className="diagram-node">Program Terminates (`return 0`)</div>
                                    </div>
                                    <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Modularity through functions is crucial for large codebases like those at LinkedIn. Breaking down complex problems (e.g., user authentication, data fetching) into smaller, reusable functions improves code maintainability, reduces bugs, and allows multiple developers to work on different parts of the system concurrently. Even in highly optimized systems, functions are the primary way to organize and reuse code effectively.</p>
                                </div>
                            </>
                        )}

                        {renderContentSection('c-variables-constants',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Variables & Constants <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">This section covers the basic data containers in C: variables, whose values can change, and constants, whose values are fixed. Understanding how to declare and use them is essential for any program.</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-4">Variable</h3>
                                        <p>A named memory location that stores a value. The value can be modified during program execution.</p>
                                        <div className="code-block mt-4"><div>int score = 0;</div><div>score = 100; <span className="text-gray-400">// Value changed</span></div></div>
                                        <p className="mt-2 text-gray-600">Variables are temporary storage for dynamic data that changes during program execution, like user input, loop counters, or calculated results.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-4">Constant</h3>
                                        <p>A variable whose value cannot be changed after initialization. Declared using the `const` keyword. Ensures data integrity for fixed values.</p>
                                        <div className="code-block mt-4"><div>const float PI = 3.14;</div><div><span className="text-red-400">// PI = 3.14159; // Compile-time error</span></div></div>
                                        <p className="mt-2 text-gray-600">Constants improve code readability and maintainability, making it clear which values are fixed and should not be altered accidentally.</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-4 mt-8">Data Type Qualifiers <span className="level-badge level-intermediate">Intermediate</span></h3>
                                <p className="text-gray-600">These keywords modify the properties of variables beyond their basic data type, affecting their mutability and compiler optimizations.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h4 className="font-bold text-lg text-indigo-700">`const` Qualifier</h4>
                                        <p>Used to declare constants. The value cannot be changed after initialization. Applied to variables, function parameters, and return types.</p>
                                        <div className="code-block mt-4"><div>const int MAX_USERS = 1000;</div><div>int *const ptr_to_const_int; <span className="text-gray-400">// Pointer is constant, not value</span></div></div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h4 className="font-bold text-lg text-indigo-700">`volatile` Qualifier</h4>
                                        <p>Hints to the compiler that a variable's value might change unexpectedly (e.g., by hardware, another thread, or an interrupt service routine), preventing aggressive compiler optimizations that might assume the value is stable.</p>
                                        <div className="code-block mt-4"><div>volatile int sensor_value;</div><div><span className="text-gray-400">// Ensures compiler re-reads sensor_value each time</span></div></div>
                                        <p className="text-sm text-gray-500 mt-2">Less common in general application programming, crucial for embedded systems.</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> In any application, variables store dynamic data (like a user's current session score on a game, or the number of likes on an Instagram post). Constants are used for fixed values like mathematical constants or configuration parameters (e.g., API keys, database connection strings) which should not change during runtime, ensuring stability and security. `volatile` is critical in real-time embedded systems (e.g., flight control systems, medical devices) where hardware interactions are unpredictable and compiler optimizations could lead to incorrect behavior.</p>
                            </>
                        )}

                        {renderContentSection('c-structs-unions',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Structures & Unions <span className="level-badge level-intermediate">Intermediate</span></h2>
                                <p className="text-lg text-gray-600">Structures and Unions are user-defined data types that allow you to group different data types together under a single name. While similar, they have a critical difference in how they manage memory.</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2">Structure (`struct`)</h3>
                                        <p className="mb-4">Allocates separate memory for each member. Subject to memory padding for alignment, which can lead to unused space.</p>
                                        <div className="code-block text-sm">
                                            <div>struct Demo {'{'}</div>
                                            <div>  char c;  <span className="text-gray-400">// 1 byte</span></div>
                                            <div>  int i;   <span className="text-gray-400">// 4 bytes</span></div>
                                            <div>{'}'};</div>
                                        </div>
                                        <CStructPaddingChart />
                                        <p className="text-center text-sm text-gray-500 mt-2">In this example, `char c` (1 byte) is followed by `int i` (4 bytes). To align `i` to a 4-byte boundary, 3 bytes of padding are added after `c`, making the total size 8 bytes, not 5. The total size is a multiple of the largest member's size (4 bytes for `int`).</p>
                                        <p className="mt-2 text-sm text-gray-600">The `#pragma pack(n)` directive (e.g., `#pragma pack(1)`) can be used to control padding, forcing `n` byte alignment. This is an advanced optimization used in specific scenarios like network packet serialization, but can sometimes degrade performance due to misaligned memory access.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2">Union (`union`)</h3>
                                        <p className="mb-4">All members share the same memory location. The size of the union is the size of its largest member. Only one member can be actively used at a time; assigning a value to one member overwrites the others.</p>
                                        <div className="code-block text-sm">
                                            <div>union Data {'{'}</div>
                                            <div>  int i;</div>
                                            <div>  float f;</div>
                                            <div>  char str[20];</div>
                                            <div>{'}'};</div>
                                        </div>
                                        <p className="mt-4 text-gray-600">The `Data` union will be 20 bytes (the size of `char str[20]`), as all members overlap in the same memory space. If you assign a value to `i`, then `f`, `i`'s value will be overwritten. Unions are memory-efficient when you only need to store one type of data at a given time.</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-4 mt-8">Memory Layout Comparison: Struct vs. Union</h3>
                                <div className="diagram-container flex-row items-start justify-center text-left">
                                    <div className="flex flex-col items-center mx-4">
                                        <h4 className="font-bold text-lg text-indigo-700">Struct `Demo` (8 bytes)</h4>
                                        <div className="border border-gray-300 p-2 rounded-lg bg-gray-50 mt-2">
                                            <div className="flex items-center">
                                                <div className="memory-block bg-blue-200">c (1 byte)</div>
                                                <span className="ml-2 text-gray-600">@ 0x00</span>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <div className="memory-block bg-gray-300 w-16">Padding (3 bytes)</div>
                                                <span className="ml-2 text-gray-600">@ 0x01-0x03</span>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <div className="memory-block bg-green-200 w-24">i (4 bytes)</div>
                                                <span className="ml-2 text-gray-600">@ 0x04</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">Separate memory for each member, with padding.</p>
                                    </div>
                                    <div className="flex flex-col items-center mx-4">
                                        <h4 className="font-bold text-lg text-indigo-700">Union `Data` (20 bytes)</h4>
                                        <div className="border border-gray-300 p-2 rounded-lg bg-gray-50 mt-2 relative">
                                            <div className="memory-block bg-red-200 w-32 h-12 flex items-center justify-center">i (4 bytes)</div>
                                            <div className="memory-block bg-yellow-200 w-32 h-12 flex items-center justify-center absolute top-2 left-2">f (4 bytes)</div>
                                            <div className="memory-block bg-purple-200 w-32 h-12 flex items-center justify-center absolute top-2 left-2">str (20 bytes)</div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">All members share the same memory space.</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Structures are essential for organizing complex data, such as user profiles (LinkedIn, Facebook) or restaurant details (Zomato), where each entity has multiple attributes of different types. Unions are rarer but used in highly memory-constrained environments or for type-punnng, where different interpretations of the same memory block are needed (e.g., low-level communication protocols, embedded firmware) to save memory.</p>
                            </>
                        )}

                        {renderContentSection('c-storage-classes',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Storage Classes <span className="level-badge level-intermediate">Intermediate</span></h2>
                                <p className="text-lg text-gray-600">Storage classes in C define the **scope** (visibility), **lifetime** (duration), **default initial value**, and **memory location** of variables and functions. Understanding them is crucial for managing data persistence and visibility across your program.</p>
                                <div className="overflow-x-auto bg-white rounded-lg shadow">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Keyword</th>
                                                <th scope="col" className="px-6 py-3">Memory Location</th>
                                                <th scope="col" className="px-6 py-3">Default Value</th>
                                                <th scope="col" className="px-6 py-3">Scope</th>
                                                <th scope="col" className="px-6 py-3">Lifetime</th>
                                                <th scope="col" className="px-6 py-3">Industrial Use Cases</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white border-b">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">`auto`</th>
                                                <td className="px-6 py-4">Stack</td>
                                                <td className="px-6 py-4">Garbage</td>
                                                <td className="px-6 py-4">Local (within block)</td>
                                                <td className="px-6 py-4">Until block ends</td>
                                                <td className="px-6 py-4">Most common for temporary function data.</td>
                                            </tr>
                                            <tr className="bg-white border-b">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">`register`</th>
                                                <td className="px-6 py-4">CPU Registers (if possible)</td>
                                                <td className="px-6 py-4">Garbage</td>
                                                <td className="px-6 py-4">Local (within block)</td>
                                                <td className="px-6 py-4">Until block ends</td>
                                                <td className="px-6 py-4">Optimizing loop counters in performance-critical code (e.g., graphics rendering, embedded loops).</td>
                                            </tr>
                                            <tr className="bg-white border-b">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">`static`</th>
                                                <td className="px-6 py-4">Data Section</td>
                                                <td className="px-6 py-4">Zero</td>
                                                <td className="px-6 py-4">Local (within function) or File (for global static)</td>
                                                <td className="px-6 py-4">Entire Program</td>
                                                <td className="px-6 py-4">Maintaining a function call count (e.g., for analytics), implementing singleton patterns (in C++), hiding global data within a specific file.</td>
                                            </tr>
                                            <tr className="bg-white">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900">`extern`</th>
                                                <td className="px-6 py-4">Data Section</td>
                                                <td className="px-6 py-4">Zero</td>
                                                <td className="px-6 py-4">Global (across files)</td>
                                                <td className="px-6 py-4">Entire Program</td>
                                                <td className="px-6 py-4">Sharing global configuration or shared data structures (e.g., error codes, large lookup tables) across multiple source files in large projects.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <h3 className="text-xl font-semibold mb-4 mt-8">Conceptual Diagram: Memory Location by Storage Class</h3>
                                <div className="diagram-container flex-row items-center justify-center">
                                    <div className="flex flex-col items-center mx-4">
                                        <div className="diagram-node bg-blue-300">`auto` / `register`</div>
                                        <div className="diagram-line"></div>
                                        <div className="bg-blue-100 p-2 rounded-lg text-sm">Stack / CPU Registers</div>
                                    </div>
                                    <div className="diagram-horizontal-line"></div>
                                    <div className="flex flex-col items-center mx-4">
                                        <div className="diagram-node bg-green-300">`static` / `extern`</div>
                                        <div className="diagram-line"></div>
                                        <div className="bg-green-100 p-2 rounded-lg text-sm">Data Section</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {renderContentSection('c-paradigms',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Programming Paradigms <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">While C is known as a procedural language, it provides constructs that are the basis for several programming paradigms. These control the flow of execution in a program.</p>
                                <div className="diagram-container">
                                    <div className="diagram-node">Programming Paradigms (in C)</div>
                                    <div className="diagram-line"></div>
                                    <div className="diagram-flex-row">
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node">Sequence</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <span>Statements execute one after another.</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node">Selection</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <span>`if-else`, `switch` for conditional execution.</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node">Iteration</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <span>`for`, `while`, `do-while` for repeated execution.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2 text-center">Sequence</h3>
                                        <p>Statements are executed one after another in the order they are written.</p>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> Found in nearly all code; fundamental for any sequential task like data logging or file processing. Example: Reading configuration files line by line.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2 text-center">Selection</h3>
                                        <p>A specific block of code is executed based on a condition, using `if-else` or `switch` statements.</p>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> Critical for decision-making logic, like routing user requests (Facebook), applying discounts (Zomato), or handling different user roles (LinkedIn). Example: Displaying different content based on user's subscription status.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2 text-center">Iteration</h3>
                                        <p>A block of code is executed repeatedly using loops like `for`, `while`, or `do-while`.</p>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> Processing large datasets, iterating through user feeds (Instagram), or performing repeated calculations in analytics. Example: Fetching and displaying 100 posts in a user's timeline.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {renderContentSection('c-io',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Basic Input/Output (I/O) <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">To interact with the user, C programs use standard input and output functions, primarily `printf()` for output and `scanf()` for input. These are defined in the `stdio.h` header file (Standard Input/Output Header).</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2">`printf()` - Formatted Output</h3>
                                        <p>Displays text and variable values on the console. Uses format specifiers to interpret data types.</p>
                                        <div className="code-block mt-4">
                                            <div>int age = 25;</div>
                                            <div>float height = 5.9;</div>
                                            <div>printf("My age is %d and height is %.1f\\n", age, height);</div>
                                            <div><span className="text-gray-400">// Output: My age is 25 and height is 5.9</span></div>
                                        </div>
                                        <p className="mt-2 text-gray-600"><strong>Format Specifiers:</strong> `%d` (int), `%f` (float), `%c` (char), `%s` (string), `%.1f` (float with 1 decimal place), etc.</p>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> Debugging, logging messages to console/files (e.g., server logs for Facebook's services to track activity), simple user prompts in command-line interface (CLI) tools.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2">`scanf()` - Formatted Input</h3>
                                        <p>Reads data from the console and stores it in variables. Requires the address-of operator (`&`) for variables to store the input directly into their memory location.</p>
                                        <div className="code-block mt-4">
                                            <div>int age;</div>
                                            <div>char name[20];</div>
                                            <div>printf("Enter your age: ");</div>
                                            <div>scanf("%d", &age);</div>
                                            <div>printf("Enter your name: ");</div>
                                            <div>scanf("%s", name); <span className="text-gray-400">// No & needed for char array (string)</span></div>
                                        </div>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> CLI tools, initial configuration input in embedded systems, basic data entry for simple utilities where a graphical user interface is not present.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {renderContentSection('c-declaration',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C Declaration vs. Definition vs. Initialization <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">In C, it's important to distinguish between declaring, defining, and initializing a variable, as each term has a specific meaning related to type information and memory allocation. These concepts are foundational for understanding how memory is managed in C.</p>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold text-indigo-700">Declaration</h3>
                                        <p>A statement that informs the compiler about the **name** and **type** of a variable or function. It tells the compiler *what* exists. **No memory allocation** occurs at declaration.</p>
                                        <div className="code-block mt-2"><div>extern int globalVar; <span className="text-gray-400">// Declares globalVar, defined elsewhere</span></div></div>
                                        <p className="mt-2 text-gray-600">This allows the compiler to know about a variable before it encounters its actual definition, particularly useful in multi-file projects.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold text-indigo-700">Definition</h3>
                                        <p>A statement that allocates **memory** for a variable or provides the actual **implementation (body)** of a function. It tells the compiler *where* it exists and *what* it does. A variable can be declared multiple times but **defined only once** across all source files.</p>
                                        <div className="code-block mt-2"><div>int count; <span className="text-gray-400">// Defines 'count', allocates memory</span></div><div>void greet() {'{'} /* ... */ {'}'} <span className="text-gray-400">// Defines 'greet' function</span></div></div>
                                        <p className="mt-2 text-gray-600">The definition is the point where the compiler reserves space in memory for the variable.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold text-indigo-700">Initialization</h3>
                                        <p>Assigning an **initial value** to a variable at the time of its definition. This is the first value the variable holds when it's created.</p>
                                        <div className="code-block mt-2"><div>int num = 11; <span className="text-gray-400">// Declared, Defined, and Initialized</span></div></div>
                                        <p className="mt-2 text-gray-600">Uninitialized variables (especially local `auto` variables) hold "garbage" values, leading to unpredictable program behavior. Proper initialization prevents such issues.</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Precise control over declaration vs. definition helps manage global variables across large multi-file projects (e.g., a complex operating system component or a massive codebase for a platform like Instagram). For instance, a global configuration variable might be declared in a header file (`.h`) but defined in a single `.c` file to prevent duplicate definitions. Proper initialization prevents undefined behavior and enhances software reliability, crucial for systems that need to run 24/7 like LinkedIn's backend or Facebook's infrastructure.</p>
                            </>
                        )}
                    </div>

                    {/* C++ Language Content Block */}
                    <div id="cpp-content-block" className={`language-content-block ${activeLanguage === 'cpp' ? 'active' : ''}`}>
                        {renderContentSection('cpp-overview',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C++ Overview & Object-Oriented Programming (OOP) <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">C++ is a powerful, multi-paradigm programming language that extends C with object-oriented features, generic programming capabilities, and more. It offers high performance along with abstraction, making it suitable for complex applications.</p>
                                <h3 className="text-xl font-semibold mb-2">Key OOP Concepts</h3>
                                <p className="text-gray-600 mb-4">Object-Oriented Programming is a paradigm based on the concept of "objects", which can contain data and code to manipulate that data. The four pillars of OOP are:</p>
                                <div className="diagram-container">
                                    <div className="diagram-node">Pillars of OOP</div>
                                    <div className="diagram-line"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                        <div className="flex flex-col items-center bg-blue-100 p-4 rounded-lg shadow-sm">
                                            <h4 className="font-bold text-lg text-indigo-700">Encapsulation 📦</h4>
                                            <p className="text-gray-600 text-sm text-center">Bundling data and methods into a single unit.</p>
                                        </div>
                                        <div className="flex flex-col items-center bg-green-100 p-4 rounded-lg shadow-sm">
                                            <h4 className="font-bold text-lg text-indigo-700">Abstraction 💡</h4>
                                            <p className="text-gray-600 text-sm text-center">Hiding complex implementation details.</p>
                                        </div>
                                        <div className="flex flex-col items-center bg-yellow-100 p-4 rounded-lg shadow-sm">
                                            <h4 className="font-bold text-lg text-indigo-700">Inheritance 🌳</h4>
                                            <p className="text-gray-600 text-sm text-center">New classes acquire properties of existing ones.</p>
                                        </div>
                                        <div className="flex flex-col items-center bg-red-100 p-4 rounded-lg shadow-sm">
                                            <h4 className="font-bold text-lg text-indigo-700">Polymorphism 🎭</h4>
                                            <p className="text-gray-600 text-sm text-center">Objects taking on many forms.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-lg shadow">
                                        <h4 className="font-bold text-lg text-indigo-700">Encapsulation</h4>
                                        <p className="text-gray-600">Bundling data (attributes) and methods (functions) that operate on the data within a single unit (e.g., a class), and restricting direct access to some of the object's components using access specifiers (`public`, `private`, `protected`).</p>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> Protecting internal data of user accounts (Facebook), ensuring data consistency for orders (Zomato). For example, a `User` class might have `private` fields for password hashes, accessible only via `public` methods.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-lg shadow">
                                        <h4 className="font-bold text-lg text-indigo-700">Abstraction</h4>
                                        <p className="text-gray-600">Hiding complex implementation details and showing only the necessary features or functionalities of an object. Users interact with a simplified interface without needing to know the underlying complexity.</p>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> When a user interacts with a "Send Message" button (LinkedIn), they don't need to know the complex network protocols, data serialization, and server-side logic involved. Abstract classes or interfaces define the public API.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-lg shadow">
                                        <h4 className="font-bold text-lg text-indigo-700">Inheritance</h4>
                                        <p className="text-gray-600">A mechanism where one class (derived/child class) acquires the properties and behaviors (data members and methods) of another class (base/parent class), promoting code reusability and establishing a "is-a" relationship.</p>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> A `PremiumUser` class inheriting from a `User` class (LinkedIn), reusing common attributes like `username`, `email` and adding specific ones like `subscriptionTier` and `premiumFeatures`. This reduces code duplication and simplifies maintenance.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-lg shadow">
                                        <h4 className="font-bold text-lg text-indigo-700">Polymorphism</h4>
                                        <p className="text-gray-600">The ability of an object to take on many forms. It allows objects of different classes that share a common base class to be treated as objects of that base class, providing a single interface for different types. Achieved through virtual functions (runtime) and function/operator overloading (compile-time).</p>
                                        <p className="mt-2 text-gray-600"><strong>Industrial Use:</strong> A "Notification" system (Instagram) that can send different types of notifications (email, SMS, in-app push) using a common `send()` method defined in a base `Notification` class. The specific `send()` implementation is chosen at runtime based on the actual notification type.</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> C++ is heavily used in game development (high performance, direct hardware access), high-frequency trading systems, operating systems, and resource-constrained applications. Its OOP features enable building complex, scalable software with clear module boundaries, essential for massive projects like parts of Facebook's infrastructure or Google Chrome. OOP promotes code modularity and extensibility, which is crucial for evolving large software systems.</p>
                            </>
                        )}

                        {renderContentSection('cpp-classes-objects',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C++ Classes & Objects <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">In C++, a `class` is a blueprint for creating objects, providing an initial structure and behavior. An `object` is an instance of a class, representing a real-world entity.</p>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold mb-2">Class Definition & Object Creation</h3>
                                    <div className="code-block text-sm">
                                        <div><span className="text-blue-400">class</span> <span className="text-yellow-300">Car</span> {'{'}</div>
                                        <div><span className="text-blue-400">public:</span></div>
                                        <div>    <span className="text-pink-400">std::string</span> <span className="text-green-400">model</span>;</div>
                                        <div>    <span className="text-pink-400">int</span> <span className="text-green-400">year</span>;</div>
                                        <div>    <span className="text-pink-400">void</span> <span className="text-yellow-300">start</span>() {'{'} <span className="text-gray-400">// Method</span></div>
                                        <div>        printf("The %d %s car started!\\n", year, model.c_str());</div>
                                        <div>    {'}'}</div>
                                        <div>{'}'};</div>
                                        <div className="mt-4"><span className="text-yellow-300">Car</span> <span className="text-green-400">myCar</span>; <span className="text-gray-400">// Creating an object (instance) of Car class</span></div>
                                        <div><span className="text-green-400">myCar</span>.<span className="text-green-400">model</span> = "Tesla Model 3";</div>
                                        <div><span className="text-green-400">myCar</span>.<span className="text-green-400">year</span> = 2023;</div>
                                        <div><span className="text-green-400">myCar</span>.<span className="text-yellow-300">start</span>(); <span className="text-gray-400">// Calling a method on the object</span></div>
                                    </div>
                                    <div className="object-container">
                                        <div className="object-box">
                                            <h4 className="font-bold text-lg">Class: Car</h4>
                                            <p className="text-sm">Blueprint</p>
                                            <div className="object-arrow"></div>
                                        </div>
                                        <div className="object-box ml-16">
                                            <h4 className="font-bold text-lg">Object: myCar</h4>
                                            <p className="text-sm">Instance</p>
                                            <ul className="list-disc list-inside text-xs mt-2">
                                                <li>Model: "Tesla Model 3"</li>
                                                <li>Year: 2023</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600"><strong>Industrial Use:</strong> Every entity in a complex system can be modeled as a class. For example, a `User` class in Facebook (representing a user profile), an `Order` class in Zomato (representing a food order), or a `JobPosting` class in LinkedIn, each encapsulating their respective data and behaviors. This object-oriented approach makes large systems manageable and maintainable.</p>
                                </div>
                            </>
                        )}

                        {renderContentSection('cpp-inheritance',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C++ Inheritance <span className="level-badge level-intermediate">Intermediate</span></h2>
                                <p className="text-lg text-gray-600">Inheritance is an OOP concept where a new class (derived class) is created from an existing class (base class). The derived class inherits attributes and behaviors from the base class, promoting code reusability and establishing a "is-a" relationship.</p>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold mb-2">Example: Base and Derived Class</h3>
                                    <div className="code-block text-sm">
                                        <div><span className="text-blue-400">class</span> <span className="text-yellow-300">Animal</span> {'{'}</div>
                                        <div><span className="text-blue-400">public:</span></div>
                                        <div>    <span className="text-pink-400">std::string</span> <span className="text-green-400">species</span>;</div>
                                        <div>    <span className="text-pink-400">void</span> <span className="text-yellow-300">eat</span>() {'{'} printf("Animal eats.\\n"); {'}'}</div>
                                        <div>{'}'};</div>
                                        <div className="mt-2"><span className="text-blue-400">class</span> <span className="text-yellow-300">Dog</span> : <span className="text-blue-400">public</span> <span className="text-yellow-300">Animal</span> {'{'} <span className="text-gray-400">// Dog inherits from Animal</span></div>
                                        <div><span className="text-blue-400">public:</span></div>
                                        <div>    <span className="text-pink-400">std::string</span> <span className="text-green-400">breed</span>;</div>
                                        <div>    <span className="text-pink-400">void</span> <span className="text-yellow-300">bark</span>() {'{'} printf("Dog barks.\\n"); {'}'}</div>
                                        <div>{'}'};</div>
                                        <div className="mt-4"><span className="text-yellow-300">Dog</span> <span className="text-green-400">myDog</span>;</div>
                                        <div><span className="text-green-400">myDog</span>.<span className="text-green-400">species</span> = "Canine"; <span className="text-gray-400">// Inherited attribute</span></div>
                                        <div><span className="text-green-400">myDog</span>.<span className="text-green-400">breed</span> = "Golden Retriever";</div>
                                        <div><span className="text-green-400">myDog</span>.<span className="text-yellow-300">eat</span>(); <span className="text-gray-400">// Inherited method</span></div>
                                        <div><span className="text-green-400">myDog</span>.<span className="text-yellow-300">bark</span>(); <span className="text-gray-400">// Dog's own method</span></div>
                                    </div>
                                    <div className="diagram-container flex-col">
                                        <div className="diagram-node bg-blue-200">Animal (Base Class)</div>
                                        <div className="diagram-arrow">is-a &darr;</div>
                                        <div className="diagram-node bg-green-200">Dog (Derived Class)</div>
                                    </div>
                                    <p className="mt-4 text-gray-600"><strong>Industrial Use:</strong> Used extensively in large software frameworks (e.g., UI frameworks, network protocols) to create specialized components from general ones. In Facebook, different types of `Post` (TextPost, PhotoPost, VideoPost) might inherit common properties and methods from a base `Post` class. This approach promotes modularity, reduces code duplication, and makes systems easier to extend and maintain.</p>
                                </div>
                            </>
                        )}

                        {renderContentSection('cpp-polymorphism',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C++ Polymorphism <span className="level-badge level-intermediate">Intermediate</span></h2>
                                <p className="text-lg text-gray-600">Polymorphism allows objects of different classes to be treated as objects of a common base class, providing a single interface for different types. It's often achieved through virtual functions and pointers/references to base classes (runtime polymorphism), or function/operator overloading (compile-time polymorphism).</p>
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold mb-2">Runtime Polymorphism (Virtual Functions)</h3>
                                    <p className="text-gray-600 mb-4">The `virtual` keyword enables a function in a base class to be overridden by a derived class, and the correct function version is called at runtime based on the actual object type, not the pointer/reference type.</p>
                                    <div className="code-block text-sm">
                                        <div><span className="text-blue-400">class</span> <span className="text-yellow-300">Shape</span> {'{'}</div>
                                        <div><span className="text-blue-400">public:</span></div>
                                        <div>    <span className="text-blue-400">virtual</span> <span className="text-pink-400">void</span> <span className="text-yellow-300">draw</span>() {'{'} printf("Drawing a generic shape.\\n"); {'}'}</div>
                                        <div>    <span className="text-blue-400">virtual</span> ~<span className="text-yellow-300">Shape</span>() {'{'} {'}'} <span className="text-gray-400">// Virtual destructor for proper cleanup</span></div>
                                        <div>{'}'};</div>
                                        <div className="mt-2"><span className="text-blue-400">class</span> <span className="text-yellow-300">Circle</span> : <span className="text-blue-400">public</span> <span className="text-yellow-300">Shape</span> {'{'};</div>
                                        <div><span className="text-blue-400">public:</span></div>
                                        <div>    <span className="text-pink-400">void</span> <span className="text-yellow-300">draw</span>() <span className="text-blue-400">override</span> {'{'} printf("Drawing a circle.\\n"); {'}'}</div>
                                        <div>{'}'};</div>
                                        <div className="mt-2"><span className="text-blue-400">class</span> <span className="text-yellow-300">Square</span> : <span className="text-blue-400">public</span> <span className="text-yellow-300">Shape</span> {'{'};</div>
                                        <div><span className="text-blue-400">public:</span></div>
                                        <div>    <span className="text-pink-400">void</span> <span className="text-yellow-300">draw</span>() <span className="text-blue-400">override</span> {'{'} printf("Drawing a square.\\n"); {'}'}</div>
                                        <div>{'}'};</div>
                                        <div className="mt-4"><span className="text-yellow-300">Shape</span>* <span className="text-green-400">s1</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">Circle</span>();</div>
                                        <div><span className="text-yellow-300">Shape</span>* <span className="text-green-400">s2</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">Square</span>();</div>
                                        <div><span className="text-green-400">s1</span>-&gt;<span className="text-yellow-300">draw</span>(); <span className="text-gray-400">// Output: Drawing a circle. (Runtime decision)</span></div>
                                        <div><span className="text-green-400">s2</span>-&gt;<span className="text-yellow-300">draw</span>(); <span className="text-gray-400">// Output: Drawing a square. (Runtime decision)</span></div>
                                        <div><span className="text-blue-400">delete</span> <span className="text-green-400">s1</span>; <span className="text-blue-400">delete</span> <span className="text-green-400">s2</span>;</div>
                                    </div>
                                    <div className="diagram-container flex-col">
                                        <div className="diagram-node">Base Class: Shape</div>
                                        <div className="diagram-line"></div>
                                        <div className="diagram-flex-row">
                                            <div className="flex flex-col items-center mx-4">
                                                <div className="diagram-node bg-blue-200">Derived: Circle</div>
                                            </div>
                                            <div className="diagram-horizontal-line"></div>
                                            <div className="flex flex-col items-center mx-4">
                                                <div className="diagram-node bg-green-200">Derived: Square</div>
                                            </div>
                                        </div>
                                        <div className="diagram-info-box mt-4">
                                            <p className="text-indigo-800 text-sm">A `Shape` pointer can point to a `Circle` or `Square` object. Calling `draw()` on the `Shape` pointer will execute the correct `draw()` method for the actual object type at runtime.</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600"><strong>Industrial Use:</strong> Essential for building flexible and extensible systems. A common example is in GUI frameworks where different UI elements (buttons, text boxes, images) might all inherit from a common `Widget` class and implement a `draw()` method polymorphically. This allows a rendering engine to draw various elements without knowing their specific types. Also crucial for plugin architectures and command patterns in large applications.</p>
                                </div>
                            </>
                        )}

                        {renderContentSection('cpp-smart-pointers',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C++ Smart Pointers <span className="level-badge level-advanced">Advanced</span></h2>
                                <p className="text-lg text-gray-600">Smart pointers are C++ features that act like traditional pointers but provide automatic memory management, preventing memory leaks and dangling pointers. They are crucial for modern C++ development by implementing RAII (Resource Acquisition Is Initialization) principles.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2">`std::unique_ptr`</h3>
                                        <p>Provides **exclusive ownership** of the managed object. When a `unique_ptr` goes out of scope, the object it points to is automatically deleted. It cannot be copied, only moved.</p>
                                        <div className="code-block mt-4">
                                            <div>#include &lt;memory&gt;</div>
                                            <div><span className="text-blue-400">std::unique_ptr</span>&lt;<span className="text-pink-400">int</span>&gt; <span className="text-yellow-300">ptr1</span>(<span className="text-blue-400">new</span> <span className="text-pink-400">int</span>(10));</div>
                                            <div>printf("Value: %d\\n", *<span className="text-yellow-300">ptr1</span>);</div>
                                            <div><span className="text-gray-400">// std::unique_ptr&lt;int&gt; ptr2 = ptr1; // Compile error: cannot copy unique_ptr</span></div>
                                            <div><span className="text-blue-400">std::unique_ptr</span>&lt;<span className="text-pink-400">int</span>&gt; <span className="text-yellow-300">ptr3</span> = <span className="text-blue-400">std::move</span>(<span className="text-yellow-300">ptr1</span>); <span className="text-gray-400">// Ownership transferred</span></div>
                                            <div><span className="text-gray-400">// No need for explicit delete, memory freed automatically when ptr3 goes out of scope</span></div>
                                        </div>
                                        <div className="diagram-container flex-col">
                                            <h4 className="font-bold text-lg text-indigo-700">Unique Ownership</h4>
                                            <div className="flex items-center justify-center mt-4">
                                                <div className="pointer-box">Unique Ptr 🎯</div>
                                                <div className="diagram-horizontal-line"></div>
                                                <div className="pointer-target-box">Object</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2">`std::shared_ptr`</h3>
                                        <p>Provides **shared ownership** of the managed object. It uses a reference count; the object is deleted only when the last `shared_ptr` pointing to it is destroyed. Can be copied.</p>
                                        <div className="code-block mt-4">
                                            <div>#include &lt;memory&gt;</div>
                                            <div><span className="text-blue-400">std::shared_ptr</span>&lt;<span className="text-pink-400">int</span>&gt; <span className="text-yellow-300">ptr1</span>(<span className="text-blue-400">new</span> <span className="text-pink-400">int</span>(20));</div>
                                            <div>printf("Count: %ld\\n", <span className="text-yellow-300">ptr1</span>.use_count()); <span className="text-gray-400">// Output: 1</span></div>
                                            <div><span className="text-blue-400">std::shared_ptr</span>&lt;<span className="text-pink-400">int</span>&gt; <span className="text-yellow-300">ptr2</span> = <span className="text-yellow-300">ptr1</span>; <span className="text-gray-400">// ptr2 now shares ownership</span></div>
                                            <div>printf("Count: %ld\\n", <span className="text-yellow-300">ptr1</span>.use_count()); <span className="text-gray-400">// Output: 2</span></div>
                                            <div><span className="text-gray-400">// Object deleted when both ptr1 and ptr2 go out of scope</span></div>
                                        </div>
                                        <div className="diagram-container flex-col">
                                            <h4 className="font-bold text-lg text-indigo-700">Shared Ownership (Reference Counting)</h4>
                                            <div className="flex items-center justify-center mt-4">
                                                <div className="pointer-box mr-8">Shared Ptr 1 🎯</div>
                                                <div className="pointer-target-box mr-8">Object (Ref Count: 2)</div>
                                                <div className="pointer-box">Shared Ptr 2 🎯</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Smart pointers are vital in large C++ applications (e.g., Google Chrome, Adobe products, game engines, complex financial systems). They significantly reduce common memory bugs like memory leaks and dangling pointers, improve code reliability, and simplify resource management, allowing developers to focus on application logic rather than error-prone manual memory deallocation. `unique_ptr` is preferred for exclusive ownership, while `shared_ptr` is used when multiple parts of the codebase need to manage the same resource's lifetime.</p>
                            </>
                        )}

                        {renderContentSection('cpp-stl',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">C++ Standard Template Library (STL) <span className="level-badge level-intermediate">Intermediate</span></h2>
                                <p className="text-lg text-gray-600">The STL is a powerful set of C++ template classes and functions that provide generic algorithms and data structures. It significantly boosts productivity and code quality by offering highly optimized and tested components.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2">Containers 📦</h3>
                                        <p>Generic data structures that store collections of objects, providing efficient ways to manage and access data.</p>
                                        <ul className="list-disc list-inside mt-2">
                                            <li>`std::vector`: Dynamic array. Efficient random access, flexible size.</li>
                                            <li>`std::list`: Doubly linked list. Efficient insertions/deletions anywhere.</li>
                                            <li>`std::map`: Sorted associative array (key-value pairs) based on balanced binary search trees. Efficient lookups, insertions, deletions.</li>
                                            <li>`std::unordered_map`: Unsorted associative array (key-value pairs) based on hash tables. Faster average lookups, insertions, deletions.</li>
                                            <li>`std::set`, `std::queue`, `std::stack`, etc.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold mb-2">Algorithms ⚙️</h3>
                                        <p>Generic functions that perform common operations on ranges of elements, independent of the container type.</p>
                                        <ul className="list-disc list-inside mt-2">
                                            <li>`std::sort()`: Sorts elements in a range.</li>
                                            <li>`std::find()`: Searches for a specific value in a range.</li>
                                            <li>`std::for_each()`: Applies a function to each element in a range.</li>
                                            <li>`std::copy()`, `std::remove()`, `std::transform()`, etc.</li>
                                        </ul>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-4 mt-8">Conceptual Diagram: STL Components</h3>
                                <div className="diagram-container flex-col">
                                    <div className="diagram-node">Standard Template Library (STL)</div>
                                    <div className="diagram-line"></div>
                                    <div className="diagram-flex-row w-full justify-around">
                                        <div className="flex flex-col items-center">
                                            <div className="diagram-node bg-blue-200">Containers</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-blue-50 p-2 rounded-lg border border-blue-200 shadow-sm">
                                                `vector`, `list`, `map`, `set`
                                            </div>
                                        </div>
                                        <div className="diagram-horizontal-line h-0 w-16"></div>
                                        <div className="flex flex-col items-center">
                                            <div className="diagram-node bg-green-200">Algorithms</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-green-50 p-2 rounded-lg border border-green-200 shadow-sm">
                                                `sort`, `find`, `for_each`
                                            </div>
                                        </div>
                                        <div className="diagram-horizontal-line h-0 w-16"></div>
                                        <div className="flex flex-col items-center">
                                            <div className="diagram-node bg-yellow-200">Iterators</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-yellow-50 p-2 rounded-lg border border-yellow-200 shadow-sm">
                                                Connect Containers & Algorithms
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> STL is ubiquitous in C++ development for building robust, high-performance applications. For example, Facebook's backend might use `std::unordered_map` for fast lookups of user data, or `std::vector` to manage dynamic lists of posts. LinkedIn could use `std::sort` to order search results, and Zomato might use `std::map` to store restaurant ratings by ID. STL provides robust, efficient, and standardized solutions for common programming tasks, significantly reducing development time and improving code quality.</p>
                            </>
                        )}
                    </div>

                    {/* Java Language Content Block */}
                    <div id="java-content-block" className={`language-content-block ${activeLanguage === 'java' ? 'active' : ''}`}>
                        {renderContentSection('java-overview',
                            <>
                                <h2 className="text-3xl font-bold text-gray-800">Java Overview & JVM <span className="level-badge level-beginner">Beginner</span></h2>
                                <p className="text-lg text-gray-600">Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. Its most defining feature is platform independence, achieved through the Java Virtual Machine (JVM).</p>
                                <h3 className="text-xl font-semibold mb-2">Java Virtual Machine (JVM)</h3>
                                <p className="text-gray-600 mb-4">The JVM is the core of Java's "Write Once, Run Anywhere" philosophy. It's a virtual machine that provides a runtime environment for Java bytecode. This abstraction allows Java applications to run on any platform that has a compatible JVM installed, making it highly portable.</p>
                                <JavaJVMDiagram />
                                <h4 className="text-lg font-semibold mt-6 mb-2">JVM Components (Advanced) <span className="level-badge level-advanced">Advanced</span></h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    <li>**Classloader Subsystem:** Loads, links, and initializes class files. (See details below)</li>
                                    <li>**Runtime Data Areas:** Includes Method Area (class structure), Heap (objects), Stack (method calls, local variables), PC Register (current instruction), Native Method Stack.</li>
                                    <li>**Execution Engine:** Executes bytecode. Includes Interpreter, JIT (Just-In-Time) Compiler, and Garbage Collector.</li>
                                    <li>**Native Method Interface (JNI):** Allows Java code to interact with native applications and libraries (e.g., C/C++).</li>
                                    <li>**Native Method Libraries:** Libraries written in other languages required for JVM operations.</li>
                                </ul>

                                <h3 className="text-xl font-semibold mb-2 mt-6">Classloader Subsystem: Detailed Breakdown <span className="level-badge level-advanced">Advanced</span></h3>
                                <p className="text-gray-600 mb-4">The Classloader Subsystem is responsible for dynamically loading, linking, and initializing Java classes from various sources (like local files, network, JARs) into the JVM's runtime environment. It implements the "delegation model" to ensure security and prevent duplicate class loading.</p>
                                <ClassloaderAnimation />
                                <p className="mt-4 text-gray-600">Let's delve into each phase:</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li><strong>1. Loading:</strong>
                                        <p className="mt-1">This is the process of finding the binary data (the `.class` file) for a class or interface with a particular name and creating a `java.lang.Class` object from it. There are three default classloaders:</p>
                                        <ul className="list-disc list-inside ml-4 mt-1">
                                            <li>`Bootstrap Classloader`: Loads core Java API classes (e.g., `java.lang.*`) from `$JAVA_HOME/jre/lib`.</li>
                                            <li>`Extension Classloader`: Loads classes from `$JAVA_HOME/jre/lib/ext` directory.</li>
                                            <li>`Application Classloader`: Loads classes from the classpath (your application's classes).</li>
                                        </ul>
                                        <p className="mt-1">The <strong>Delegation Model</strong> ensures a classloader delegates class loading requests to its parent before attempting to load itself, preventing security issues and ensuring core classes are loaded by the bootstrap classloader.</p>
                                    </li>
                                    <li><strong>2. Linking:</strong>
                                        <p className="mt-1">The process of taking the binary data of a class and combining it into the JVM's runtime state. This phase has three distinct sub-stages:</p>
                                        <ul className="list-disc list-inside ml-4 mt-1">
                                            <li><strong>2a. Verification:</strong> Checks the correctness of the bytecode. It ensures the `.class` file is structurally correct, follows Java language rules, and does not pose any security threats (e.g., attempts to manipulate pointers directly). This is a crucial security step, protecting the JVM from malicious code.</li>
                                            <li><strong>2b. Preparation:</strong> Involves allocating memory for static fields (class variables) and initializing them to their default values (e.g., `0` for numeric types, `null` for objects, `false` for `boolean`). Actual user-defined initial values are set during Initialization.</li>
                                            <li><strong>2c. Resolution:</strong> This is the process of replacing symbolic references from the type with direct references. For example, if your class `MyClass` refers to `java.lang.String` or calls a `public` method from another class, the JVM resolves these symbolic names (like `java/lang/String` or `other/Class/methodName:(Ljava/lang/String;)V`) to actual memory addresses or pointers to methods within the JVM. This phase also checks access permissions (e.g., whether a class is allowed to access a `private` or `public` member of another class). If a class tries to access a non-public symbol it does not have access to, a `java.lang.IllegalAccessError` or similar linkage error will occur. This is where the visibility of symbols, including `public` members, is enforced.</li>
                                        </ul>
                                    </li>
                                    <li><strong>3. Initialization:</strong>
                                        <p className="mt-1">This is the final stage, where the JVM executes the class's static initializers and static blocks. This happens only when the class is "actively used" for the first time. Active uses include creating a new instance of the class, calling a static method, or accessing a static field (unless it's a compile-time constant).</p>
                                        <ul className="list-disc list-inside ml-4 mt-1">
                                            <li>Example: Initializing a static `Logger` instance in a utility class or populating a static `HashMap` with configuration data.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </>
                        )}
                        <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> The Classloader Subsystem is critical for the robustness and security of large Java applications. In enterprise systems (LinkedIn, Zomato, Facebook backend), it enables hot-swapping code, dynamic loading of plugins, and efficient deployment of microservices without restarting the entire application. The security checks during verification and resolution prevent untrusted code from corrupting the JVM or accessing sensitive data, which is paramount in multi-tenant environments or systems exposed to external inputs.</p>
                    </div>

                    {renderContentSection('java-oop',
                        <>
                            <h2 className="text-3xl font-bold text-gray-800">Java OOP <span className="level-badge level-beginner">Beginner</span></h2>
                            <p className="text-lg text-gray-600">Java is purely object-oriented, meaning almost everything revolves around objects and classes. It strongly enforces the four pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism) and provides robust features to support them.</p>
                            <h3 className="text-xl font-semibold mb-2">Key Differences in Java OOP:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>**No Pointers (Direct):** Java abstracts away explicit pointers, reducing common memory-related errors found in C/C++. Objects are managed by references.</li>
                                <li>**Classes & Objects Everywhere:** Even primitive types have corresponding wrapper classes (e.g., `Integer` for `int`) for use in collections.</li>
                                <li>**Interfaces:** A key mechanism for achieving abstraction and polymorphism, allowing a class to implement multiple interfaces.</li>
                                <li>**Packages:** Used for organizing classes and preventing naming conflicts, crucial for large-scale projects.</li>
                            </ul>
                            <div className="code-block mt-4">
                                <div><span className="text-blue-400">public</span> <span className="text-blue-400">class</span> <span className="text-yellow-300">UserProfile</span> {'{'}</div>
                                <div>    <span className="text-blue-400">private</span> <span className="text-pink-400">String</span> <span className="text-green-400">name</span>;</div>
                                <div>    <span className="text-blue-400">private</span> <span className="text-pink-400">int</span> <span className="text-green-400">age</span>;</div>
                                <div>    <span className="text-blue-400">public</span> <span className="text-yellow-300">UserProfile</span>(<span className="text-pink-400">String</span> <span className="text-green-400">name</span>, <span className="text-pink-400">int</span> <span className="text-green-400">age</span>) {'{'}</div>
                                <div>        <span className="text-blue-400">this</span>.<span className="text-green-400">name</span> = <span className="text-green-400">name</span>;</div>
                                <div>        <span className="text-blue-400">this</span>.<span className="text-green-400">age</span> = <span className="text-green-400">age</span>;</div>
                                <div>    {'}'}</div>
                                <div>    <span className="text-blue-400">public</span> <span className="text-pink-400">String</span> <span className="text-yellow-300">getName</span>() {'{'}</div>
                                <div>        <span className="text-purple-400">return</span> <span className="text-green-400">name</span>;</div>
                                <div>    {'}'}</div>
                                <div>    <span className="text-blue-400">public</span> <span className="text-pink-400">int</span> <span className="text-yellow-300">getAge</span>() {'{'}</div>
                                <div>        <span className="text-purple-400">return</span> <span className="text-green-400">age</span>;</div>
                                <div>    {'}'}</div>
                                <div>{'}'}</div>
                                <div className="mt-4"><span className="text-yellow-300">UserProfile</span> <span className="text-green-400">user</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">UserProfile</span>("Alice", 30);</div>
                                <div>System.out.println(<span className="text-green-400">user</span>.<span className="text-yellow-300">getName</span>() + " is " + <span className="text-green-400">user</span>.<span className="text-yellow-300">getAge</span>() + " years old."); <span className="text-gray-400">// Output: Alice is 30 years old.</span></div>
                            </div>
                            <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Java's strong OOP paradigm is ideal for building complex, modular, and scalable systems. Platforms like Instagram and Facebook rely on well-designed class hierarchies and object interactions for managing diverse content types (photos, videos, stories) and user features. Android app development is entirely based on Java/Kotlin OOP, making it fundamental for mobile application development.</p>
                        </>
                    )}

                    {renderContentSection('java-gc',
                        <>
                            <h2 className="text-3xl font-bold text-gray-800">Java Garbage Collection <span className="level-badge level-intermediate">Intermediate</span></h2>
                            <p className="text-lg text-gray-600">Unlike C/C++ where memory management is largely manual, Java features automatic memory management through its Garbage Collector (GC). The GC automatically reclaims memory occupied by objects that are no longer referenced by the program, preventing memory leaks.</p>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-semibold mb-2">How it Works: The Reachability Principle</h3>
                                <p className="mb-4">The Garbage Collector works by identifying objects that are "reachable" (still in use by the program) and marking the rest as "garbage" for collection. It follows a graph of references from "GC roots" (e.g., active threads, static variables).</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>**Heap Memory:** All Java objects are created on the Heap.</li>
                                    <li>**Reachability:** An object is "reachable" if it can be accessed from a GC root (e.g., a local variable on the stack, a static field, or another object that is itself reachable).</li>
                                    <li>**Collection:** Objects that are no longer reachable become candidates for garbage collection. The GC then reclaims their memory, making it available for new objects.</li>
                                    <li>**Generational GC:** Most modern JVMs use generational garbage collection, dividing the heap into "generations" (e.g., Young Generation for short-lived objects, Old Generation for long-lived objects) to optimize collection frequency and efficiency.</li>
                                </ul>
                                <div className="diagram-container flex-col">
                                    <h4 className="font-bold text-lg text-indigo-700">Garbage Collection Concept</h4>
                                    <div className="flex items-center justify-center mt-4">
                                        <div className="diagram-node bg-indigo-200">GC Roots <br />(Stack, Statics)</div>
                                        <div className="diagram-arrow">&rarr;</div>
                                        <div className="diagram-node bg-green-200">Reachable Objects <br />(Kept)</div>
                                        <div className="diagram-arrow" style={{ transform: 'rotate(90deg) translateY(-50%)', position: 'absolute', right: '-50px', top: '120px' }}>&darr;</div>
                                        <div className="diagram-node bg-red-200" style={{ marginLeft: '100px' }}>Unreachable Objects <br />(Collected)</div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Automatic garbage collection drastically reduces memory leaks and dangling pointer issues, leading to more stable and reliable applications. This is critical for large-scale enterprise systems like those at LinkedIn and Zomato, where continuous operation and resource efficiency are paramount, as developers don't have to manually track and free every allocated memory block. It allows developers to focus more on business logic and less on low-level memory management, boosting productivity.</p>
                        </>
                    )}

                    {renderContentSection('java-concurrency',
                        <>
                            <h2 className="text-3xl font-bold text-gray-800">Java Concurrency & Multithreading <span className="level-badge level-advanced">Advanced</span></h2>
                            <p className="text-lg text-gray-600">Java has robust built-in support for concurrency, allowing programs to execute multiple parts of code simultaneously using threads. This is essential for building responsive and efficient applications, especially in server-side development, where multiple user requests need to be handled in parallel.</p>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-semibold mb-2">Key Concepts & Implementation</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>**Threads:** Lightweight units of execution within a process. Java provides two main ways to create threads:
                                        <ol className="list-decimal list-inside ml-4 mt-2">
                                            <li>**Extending `Thread` class:**
                                                <div className="code-block mt-2 mb-2 text-sm">
                                                    <div><span className="text-blue-400">class</span> <span className="text-yellow-300">MyThread</span> <span className="text-blue-400">extends</span> <span className="text-purple-400">Thread</span> {'{'}</div>
                                                    <div>    <span className="text-blue-400">public</span> <span className="text-pink-400">void</span> <span className="text-yellow-300">run</span>() {'{'}</div>
                                                    <div>        System.out.println("MyThread running!");</div>
                                                    <div>    {'}'}</div>
                                                    <div>{'}'}</div>
                                                    <div><span className="text-yellow-300">MyThread</span> <span className="text-green-400">t1</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">MyThread</span>();</div>
                                                    <div><span className="text-green-400">t1</span>.<span className="text-yellow-300">start</span>();</div>
                                                </div>
                                            </li>
                                            <li>**Implementing `Runnable` interface (recommended):**
                                                <div className="code-block mt-2 text-sm">
                                                    <div><span className="text-blue-400">class</span> <span className="text-yellow-300">MyRunnable</span> <span className="text-blue-400">implements</span> <span className="text-purple-400">Runnable</span> {'{'}</div>
                                                    <div>    <span className="text-blue-400">public</span> <span className="text-pink-400">void</span> <span className="text-yellow-300">run</span>() {'{'}</div>
                                                    <div>        System.out.println("MyRunnable running!");</div>
                                                    <div>    {'}'}</div>
                                                    <div>{'}'}</div>
                                                    <div><span className="text-yellow-300">Thread</span> <span className="text-green-400">t2</span> = <span className="text-blue-400">new</span> <span className="text-yellow-300">Thread</span>(<span className="text-blue-400">new</span> <span className="text-yellow-300">MyRunnable</span>());</div>
                                                    <div><span className="text-green-400">t2</span>.<span className="text-yellow-300">start</span>();</div>
                                                </div>
                                            </li>
                                        </ol>
                                    </li>
                                    <li>**Synchronization:** Mechanisms (e.g., `synchronized` keyword for methods/blocks, `Lock` interface, `Semaphore`) to control access to shared resources and prevent race conditions and data corruption when multiple threads access the same data concurrently.</li>
                                    <li>**Thread Pools:** Managed collections of worker threads that execute tasks. They reduce the overhead of creating and destroying threads for each task, improving performance in server applications.</li>
                                    <li>**Executors Framework:** A higher-level API for managing threads, providing features like thread pools and scheduled task execution.</li>
                                </ul>
                                <h3 className="text-xl font-semibold mb-2 mt-8">Conceptual Diagram: Multithreading</h3>
                                <div className="diagram-container flex-col">
                                    <div className="diagram-node">Program</div>
                                    <div className="diagram-line"></div>
                                    <div className="diagram-flex-row">
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node bg-blue-200">Thread 1</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-blue-50 p-2 rounded-lg border border-blue-200 shadow-sm">Task A</div>
                                        </div>
                                        <div className="diagram-horizontal-line rotate-90"></div>
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node bg-green-200">Thread 2</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-green-50 p-2 rounded-lg border border-green-200 shadow-sm">Task B</div>
                                        </div>
                                        <div className="diagram-horizontal-line rotate-90"></div>
                                        <div className="flex flex-col items-center mx-4">
                                            <div className="diagram-node bg-yellow-200">Thread 3</div>
                                            <div className="diagram-line"></div>
                                            <div className="text-sm text-gray-700 bg-yellow-50 p-2 rounded-lg border border-yellow-200 shadow-sm">Task C</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-4">Multiple threads executing tasks concurrently within the same program.</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Concurrency is vital for any modern, high-throughput application. Social media platforms (Facebook, Instagram) use multithreading to handle millions of concurrent user requests (e.g., fetching a news feed, uploading a photo) and perform background tasks (e.g., image processing, analytics). Zomato uses it for parallel processing of search queries and order placements. LinkedIn's backend processing for profile updates or job recommendations heavily relies on concurrent operations to remain responsive and efficient, maximizing CPU utilization.</p>
                        </>
                    )}

                    {renderContentSection('java-ecosystem',
                        <>
                            <h2 className="text-3xl font-bold text-gray-800">Java Ecosystem & Use Cases <span className="level-badge level-intermediate">Intermediate</span></h2>
                            <p className="text-lg text-gray-600">Beyond the language itself, Java boasts a massive and mature ecosystem of frameworks, libraries, and tools that accelerate development for various domains. This rich ecosystem is one of Java's biggest strengths.</p>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-xl font-semibold mb-2">Key Areas of Application</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>**Enterprise Applications:** Java is a dominant force in enterprise software, powering large-scale, robust backend systems with frameworks like Spring (Spring Boot, Spring MVC), Java EE (Jakarta EE).
                                        <p className="mt-1"><strong>Industrial Use:</strong> Core backends for LinkedIn (many services are Java-based), Zomato (backend services), banking systems, large corporate intranets, and complex business logic processing.</p>
                                    </li>
                                    <li>**Android App Development:** Java was the official language for native Android app development (alongside Kotlin, which also runs on the JVM).
                                        <p className="mt-1"><strong>Industrial Use:</strong> Powering Android versions of Facebook, Instagram, Zomato, and virtually every Android application, handling UI, logic, and data interactions on mobile devices.</p>
                                    </li>
                                    <li>**Big Data Technologies:** Many foundational Big Data technologies like Hadoop (for distributed storage and processing) and Apache Spark (for fast, large-scale data processing) are written in or heavily use Java.
                                        <p className="mt-1"><strong>Industrial Use:</strong> Processing vast amounts of user data, performing real-time analytics, and powering recommendation engines at scale for platforms like Facebook and LinkedIn.</p>
                                    </li>
                                    <li>**Web Applications:** Extensive use in server-side web development through frameworks like Spring MVC, Struts, JSF.
                                        <p className="mt-1"><strong>Industrial Use:</strong> Building dynamic web services, RESTful APIs, and serving web content for various online platforms and e-commerce sites.</p>
                                    </li>
                                    <li>**Desktop Applications:** While less common now, Java Swing and JavaFX were used for cross-platform desktop applications.
                                        <p className="mt-1"><strong>Industrial Use:</strong> Niche enterprise desktop applications, development tools (e.g., Eclipse IDE).</p>
                                    </li>
                                </ul>
                            </div>
                            <p className="mt-4 text-gray-600"><strong>Industrial Relevance:</strong> Java's stability, scalability, and vast ecosystem make it a primary choice for mission-critical applications where reliability and performance under heavy load are essential. Its "write once, run anywhere" philosophy is invaluable for deploying applications across diverse server infrastructures globally, supporting continuous integration/continuous deployment (CI/CD) pipelines in large organizations.</p>
                        </>
                    )}
                </main>
            </div>
            <GeminiQASection />
        </div>
    );
};

export default App;
