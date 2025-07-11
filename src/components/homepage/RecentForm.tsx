// import MoreVert from "@mui/icons-material/MoreVert";
import React from "react";
import skylabLogoPurple from "/skylabLogoPurple.svg";

type data = {
  title: string;
  lastOpened: Date;
};
const RecentForm = React.memo(({ title, lastOpened }: data) => {
  return (
    <div className="form hover:shadow transition-all ease-linear duration-200 cursor-pointer rounded-lg">
      <div className="md:px-10 md:py-14 py-10 flex justify-center items-center bg-black rounded-t-lg ">
        <img src={skylabLogoPurple} alt="Skylab Purple Logo" />
      </div>

      <div className="flex justify-between items-center w-full bg-purple text-black p-2 rounded-lg">
        <div className="md:text-lg text-base w-full">
          <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">
            {title}
          </p>
          <p>Last opened: {lastOpened.toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
});

export default RecentForm;