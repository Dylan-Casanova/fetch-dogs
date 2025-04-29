import React from "react";
import "./LoveSwitch.css"; // still assuming you have external styles

const LoveSwitch = ({ checked, onChange }) => {
  return (
    <div className="love">
      <input
        id="switch"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden" // optional: hide the ugly native checkbox
      />
      <label className="love-heart" htmlFor="switch">
        <i className="left"></i>
        <i className="right"></i>
        <i className="bottom"></i>
        <div className="round"></div>
      </label>
    </div>
  );
};

export default LoveSwitch;
