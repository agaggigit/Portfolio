export default function AboutMe() {
 return (
    <>
      <div className="h-screen flex flex-col items-center bg-grey justify-around relative">
        <div className="text-white flex flex-col items-center justify-center">
            <h1 className="font-heading font-bold text-8xl">About <span className="text-yellow">Me</span></h1>
            <p className="font-paragraph text-center text-xl w-4xl">I’m an Information Technology Student who loves solving problems through software engineering and machine learning. I build digital products that meant to last a thousand years.</p>
         </div>
         <div className="flex justify-between text-white w-screen px-12 font-paragraph text-xl">
            <div className="justify-center text-center w-md">
               <h2 className="font-heading font-bold text-4xl text-yellow">CURRENT PLAYGROUND</h2>
               <ul>
                  <li>Embedded & Microcontrollers</li>
                  <li>Native Applications</li>
                  <li>Data Engineering & ML Pipelines</li>
               </ul>
            </div>
            <div className="justify-center text-center w-md">
               <h2 className="font-heading font-bold text-4xl text-yellow">OFF THE<br/>SCREEN</h2>
               <ul>
                  <li>Casual sports & exploring nature</li>
                  <li>Acoustic music & cooking experiments</li>
                  <li>Collaborating & building with friends</li>
               </ul>  
            </div>
         </div>
         <div className="grid place-items-center">
            <h1 className="row-start-1 col-start-1 font-heading font-bold text-7xl text-white text-center z-1">Muhammad Affandi <br/> Argya Bagaskara</h1>
            <img src="Foto.png" alt="Foto Aga" className="row-start-1 col-start-1 w-xl h-auto absolute bottom-0 z-2"/>
            <h1 className="row-start-1 col-start-1 font-heading font-bold text-7xl text-transparent text-center text-stroke-2 text-stroke-white z-3">Muhammad Affandi <br/> Argya Bagaskara</h1>
         </div>
      </div>
    </>
 );
}