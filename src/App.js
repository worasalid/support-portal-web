
import React from "react";
import "antd/dist/antd.css";
import "./styles/index.scss";
import {
  isBrowser,
  isMobile
} from "react-device-detect";

import Routes from "./Routes";
// import MobileRouter

export default function App() {
  return <Routes />;
}
