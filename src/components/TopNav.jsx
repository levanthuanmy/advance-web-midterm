import React, {useEffect, useState} from "react";
import {Image} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import Cookies from "universal-cookie";
import socketIOClient from "socket.io-client";
import {API_URL} from "../config/constants";
import {get, post} from "../api";

const baseURL = API_URL;

const tabs = [
    {name: "Bảng tin", id: 0},
    {name: "Bài tập trên lớp", id: 1},
    {name: "Mọi người", id: 2},
    {name: "Số điểm", id: 3},
];

const TopNav = ({
                    showMenu,
                    setShowMenu,
                    currentTab,
                    setCurrentTab,
                    themeColor,
                }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isClass, setIsClass] = useState(false);
    const [isDropdown, setIsDropdown] = useState(false);
    const [isDropdDownNotif, setIsDropdDownNotif] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [notifArray, setNotifArray] = useState([]);
    const [newNotifCount, setNewNotifCount] = useState(0);

    const [response, setResponse] = useState("");

    const getNotificationList = async () => {
        const notification = await get(
            `/notifications`,
            cookies.get("token"),
            {}
        )
        return notification;
    }

    const addNewNotif = (notif) => {
        var newArr = notifArray;
        newArr.push(notif);
        setNotifArray(newArr)
    }
    var socket;
    useEffect(() => {
        (async () => {
            console.log("didConnect")
            var data = await getNotificationList()
            console.log("count api", data.count)
            setNewNotifCount(data.count)
            setNotifArray(data.notif.reverse())
        })()

        socket = socketIOClient(baseURL);
        socket.on("connect", function (data) {

            socket.emit('setToken', `${cookies.get("token")}`);

            socket.on('newNotif', function (data) {
                console.log("count", data.count)
                setNewNotifCount(data.count)
                setNotifArray(data.notif.reverse())
            });

            socket.on('setClientId', function (clientId) {
                console.log("socket client Id", clientId);
            });

        });
        return () => socket.disconnect();

    }, []);

    const cookies = new Cookies();

    const handleTabClicked = (id) => {
        setCurrentTab(+id);
    };

    const handleLogoutClicked = () => {
        cookies.remove("token");
        window?.sessionStorage?.removeItem("access_token");
        window?.localStorage?.clear();

        navigate("/");
        window?.location?.reload();
    };

    useEffect(() => {
        const isInClass = location.pathname.includes("/c/");
        setIsClass(isInClass);
        !isInClass && setCurrentTab(0);

        const userInfoStorage = window?.localStorage?.getItem("user-info");
        if (userInfoStorage && userInfoStorage !== "undefined") {
            setUserInfo(JSON.parse(userInfoStorage || {}));
        } else {
            setUserInfo({name: "", email: ""});
        }
    }, [location.pathname, setCurrentTab]);

    async function postSeen() {
        post(
            `/didSeenNotifications`,
            cookies.get("token"),
            {}
        )
    }

    const closeDropDownNotif = async () => {
        postSeen()
        setNewNotifCount(0)
        setIsDropdDownNotif(false)
    }
    const renderDropDown = () => {
        return (
            <div
                className={`cus-avatar-dropdown position-relative float-end ${
                    isDropdown && "cus-avatar-dropdown--show"
                }`}
            >
                <div className="mt-2 bg-white border shadow-sm cus-rounded-dot75rem text-truncate">
                    <div className="pt-3 px-3 fw-bold d-flex justify-content-between align-items-center">
                        {userInfo?.name}
                        <i className="bi bi-x-lg" onClick={() => setIsDropdown(false)}/>
                    </div>
                    <div className="mt-2 px-3 small fst-italic text-secondary">
                        {userInfo?.email}
                    </div>
                    <div className="mt-3 border-top p-3 d-flex justify-content-between">
                        <div
                            className="cus-dropdown-opt text-center border cus-rounded-dot75rem p-2 text-secondary"
                            onClick={() => navigate("/user-info")}
                        >
                            <i className="bi bi-pencil-square fs-4"/>
                            <div className="small">Chỉnh sửa</div>
                        </div>
                        <div
                            className="cus-dropdown-opt text-center border cus-rounded-dot75rem p-2 text-secondary"
                            onClick={() => handleLogoutClicked()}
                        >
                            <i className="bi bi-box-arrow-left fs-4"/>
                            <div className="small">Đăng xuất</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderNotifList = () => {
        return (
            <div className="cus-notif-list">
                {notifArray.map((item, index) => (
                    <div key={index}
                         className={`cus-dropdown-opt cus-notif text-center border cus-rounded-dot75rem p-2 m-1 text-secondary 
                         ${index < newNotifCount && "text-danger"} ${index >= newNotifCount && "text-muted"}`}
                         onClick={() => {
                         }}
                    >
                        {item.description}
                        <br/>
                        {item.time}
                    </div>

                ))}
            </div>
        )
    }

    const renderNotifDropDown = () => {
        return (
            <div
                className={`cus-notif-dropdown position-relative float-end ${
                    isDropdDownNotif && "cus-notif-dropdown--show"
                }`}
            >
                <div className="mt-2 bg-white border shadow-sm cus-rounded-dot75rem text-truncate">
                    <div className="pt-3 px-3 fw-bold d-flex justify-content-between align-items-center">
                        Thông báo
                        <i className="bi bi-x-lg" onClick={() => {
                            closeDropDownNotif()
                        }}/>
                    </div>
                    <div className="mt-3 border-top p-1 d-flex flex-column justify-content-between">
                        {renderNotifList()}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`w-100 bg-white cus-top-nav d-flex align-items-center justify-content-between border-bottom position-fixed top-0 left-0 shadow-sm`}
        >
            <div id="left" className="d-flex align-items-center">
                <div
                    className="cus-toggle-menu-btn ms-2 me-3 rounded-circle d-flex align-items-center justify-content-center text-secondary"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    {showMenu ? (
                        <i className="bi bi-x-lg h3 mb-0"/>
                    ) : (
                        <i className="bi bi-list h2 mb-0"/>
                    )}
                </div>

                <div
                    className="cus-title h2 mb-0 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    My Classroom
                </div>
            </div>

            {isClass && (
                <div id="middle" className="d-flex cursor-pointer h-100 text-secondary">
                    {tabs.map((tab, id) => (
                        <div
                            key={id}
                            className="px-3 cus-tab-item d-flex align-items-center h-100"
                            style={
                                currentTab === tab.id
                                    ? {
                                        borderBottom: `solid 3px ${themeColor || "blue"}`,
                                        color: themeColor || "blue",
                                    }
                                    : {}
                            }
                            onClick={() => handleTabClicked(tab.id)}
                        >
                            {tab.name}
                        </div>
                    ))}
                </div>
            )}

            <div id="right" className="ps-4 d-flex align-items-center">
                <div
                    className="cus-my-avatar bg-white rounded-circle me-3 border cursor-pointer"
                    onClick={() => setIsDropdDownNotif(true)}
                    onMouseLeave={() => closeDropDownNotif()}
                >
                    {/*<i className="bi bi-bell fs-3 rounded"/>*/}
                    <p>{newNotifCount}</p>
                    {renderNotifDropDown()}
                </div>
                <div
                    className="cus-my-avatar bg-white rounded-circle me-3 cursor-pointer"
                    onMouseEnter={() => setIsDropdown(true)}
                    onMouseLeave={() => setIsDropdown(false)}
                >
                    <Image
                        src={`/images/avatar.png`}
                        fluid
                        className="rounded-circle border"
                    />
                    {renderDropDown()}
                </div>
            </div>

        </div>
    );
};

export default TopNav;
