"use client";

export function GlobeLoader() {
  return (
    <>
      {/* Styles only needed for this component */}
      <style>{`
        @keyframes rotateBall {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(162px); }
          100% { transform: translateX(0); }
        }

        @keyframes moveBall {
          0%   { left: -462px; }
          50%  { left: 0; }
          100% { left: -462px; }
        }

        .section-center {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          text-align: center;
        }

        .section-path {
          position: relative;
          width: 238px;
          height: 76px;
          border-radius: 35px;
          margin: 0 auto;
          background-color: #e6e6e6;
          box-shadow: inset -2px 20px 10px 0 rgba(0,0,0,.06),
                      inset -2px 30px 10px 0 rgba(0,0,0,.04);
          border: 3px groove rgba(225,225,225,0.07);
          overflow: hidden;
        }

        .globe {
          position: relative;
          width: 66px;
          height: 66px;
          margin-top: 2px;
          margin-left: 2px;
          border-radius: 50%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.65);
          animation: rotateBall 4s ease infinite;
          overflow: hidden;
        }

        .globe::before,
        .globe::after {
          content: "";
          position: absolute;
          border-radius: 50%;
        }

        .globe::before {
          inset: 0;
          box-shadow: inset 0 0 15px #1a252f;
          opacity: 0.4;
          z-index: 1;
        }

        .globe::after {
          width: 5px;
          height: 12px;
          background-color: rgba(255,255,255,0.1);
          left: 40px;
          top: 15px;
          z-index: 2;
          box-shadow: 0 0 14px 7px rgba(255,255,255,0.1);
        }

        .wrapper {
          position: absolute;
          width: 528px;
          height: 528px;
          top: 0;
          left: -462px;
          animation: moveBall 4s ease infinite;
        }

        .wrapper span {
          position: absolute;
          top: 0;
          width: 33px;
          height: 100%;
          background-color: #5c477d;
          box-shadow: inset 0 0 25px #5c487c;
        }

        .wrapper span:nth-child(2)  { left: 33px;  background-color: #503e6d; }
        .wrapper span:nth-child(3)  { left: 66px; }
        .wrapper span:nth-child(4)  { left: 99px;  background-color: #503e6d; }
        .wrapper span:nth-child(5)  { left: 132px; }
        .wrapper span:nth-child(6)  { left: 165px; background-color: #503e6d; }
        .wrapper span:nth-child(7)  { left: 198px; }
        .wrapper span:nth-child(8)  { left: 231px; background-color: #503e6d; }
        .wrapper span:nth-child(9)  { left: 264px; }
        .wrapper span:nth-child(10) { left: 297px; background-color: #503e6d; }
        .wrapper span:nth-child(11) { left: 330px; }
        .wrapper span:nth-child(12) { left: 363px; background-color: #503e6d; }
        .wrapper span:nth-child(13) { left: 396px; }
        .wrapper span:nth-child(14) { left: 429px; background-color: #503e6d; }
        .wrapper span:nth-child(15) { left: 462px; }
        .wrapper span:nth-child(16) { left: 495px; background-color: #503e6d; }
      `}</style>

      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="section-center">
          <div className="section-path">
            <div className="globe">
              <div className="wrapper">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
