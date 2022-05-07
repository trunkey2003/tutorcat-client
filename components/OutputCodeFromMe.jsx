import {useState} from "react";
import OutputCodeModal from "./OutputCodeModal";

export default function OutputCodeFromMe({ content }) {
    const [showInputCodeModal, setShowInputCodeModal] = useState(false);

    const handleCloseInputCodeModal = () => {
        setShowInputCodeModal(false);
    };
    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    className="w-[120px] h-[40 px] bg-sky-800 rounded flex items-center justify-center mr-4"
                    onClick={() => setShowInputCodeModal(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-7 h-7 fill-white">
                        <path d="M128 96h384v256h64V80C576 53.63 554.4 32 528 32h-416C85.63 32 64 53.63 64 80V352h64V96zM624 384h-608C7.25 384 0 391.3 0 400V416c0 35.25 28.75 64 64 64h512c35.25 0 64-28.75 64-64v-16C640 391.3 632.8 384 624 384zM365.9 286.2C369.8 290.1 374.9 292 380 292s10.23-1.938 14.14-5.844l48-48c7.812-7.813 7.812-20.5 0-28.31l-48-48c-7.812-7.813-20.47-7.813-28.28 0c-7.812 7.813-7.812 20.5 0 28.31l33.86 33.84l-33.86 33.84C358 265.7 358 278.4 365.9 286.2zM274.1 161.9c-7.812-7.813-20.47-7.813-28.28 0l-48 48c-7.812 7.813-7.812 20.5 0 28.31l48 48C249.8 290.1 254.9 292 260 292s10.23-1.938 14.14-5.844c7.812-7.813 7.812-20.5 0-28.31L240.3 224l33.86-33.84C281.1 182.4 281.1 169.7 274.1 161.9z"/>
                    </svg>
                </button>
                <img src="/image/my-profile-pic.jpg" className="w-10 h-10 rounded-full"></img>
            </div>
            <OutputCodeModal
                showInputCodeModal={showInputCodeModal}
                handleCloseInputCodeModal={handleCloseInputCodeModal}
                sentSourceCode={content.sentSourceCode}
                sentOutputCode={content.sentOutputCode}
                sentLanguage={content.sentLanguage}
                sentTimeCode={content.sentTimeCode}
                sentMemoryCode={content.sentMemoryCode}
                sentWarning={content.sentWarning}
                sentInvalidCode={content.sentInvalidCode}
            />
        </>
    );
}
