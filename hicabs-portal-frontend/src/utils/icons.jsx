import React from "react";
import PropTypes from "prop-types";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const IconWrapper = ({ IconComponent, size = "medium", color = "inherit" }) => {
  return <IconComponent fontSize={size} style={{ color }} />;
};

IconWrapper.propTypes = {
  IconComponent: PropTypes.elementType.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.string,
};

export const ExpandIcon = ({ size = "medium", color = "inherit" }) => (
  <IconWrapper IconComponent={ArrowDropDownIcon} size={size} color={color} />
);

export const CollapseIcon = ({ size = "medium", color = "inherit" }) => (
  <IconWrapper IconComponent={ArrowDropUpIcon} size={size} color={color} />
);

export const DarkModeIcon = ({ size = "medium", color = "inherit" }) => (
  <IconWrapper IconComponent={Brightness4Icon} size={size} color={color} />
);

export const LightModeIcon = ({ size = "medium", color = "inherit" }) => (
  <IconWrapper IconComponent={Brightness7Icon} size={size} color={color} />
);

ExpandIcon.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.string,
};

CollapseIcon.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.string,
};

DarkModeIcon.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.string,
};

LightModeIcon.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.string,
};
