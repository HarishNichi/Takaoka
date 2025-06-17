import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useRef,
    useState,
    useEffect,
} from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useRouter } from "next/router";
import _ from "lodash";
import { TbUserCog } from "react-icons/tb";
import { MdTranslate } from "react-icons/md";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import {
    AuthenticationAuthorizationService,
    TempRegisterServices,
} from "@/services";
import { ImageComponent, DropdownSelect, DateTimeDisplay } from "@/components";
import { useAppSelector } from "@/redux/hooks";
import { useAppDispatch } from "@/redux/hooks";
import { setAdminValue, setStaffValue, setHeadquaterValue } from "@/redux/auth";
import { urlRegister } from "@/utils/constant";
import { setStaffEditedStockpile } from "@/redux/stockpile";


const AppTopbar = forwardRef((props, ref) => {
    const {
        locale,
        localeJson,
        layoutConfig,
        onMenuToggle,
        setLoader,
        onChangeLocale,
        messageCount
    } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Getting storage data with help of reducers
    const layoutReducer = useAppSelector((state) => state.layoutReducer);
    const storeData = useAppSelector((state) => state.stockpileReducer);
    const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [userName, setUserName] = useState(null);
    const url = router.pathname;
    const path = router.asPath.split("?")[0];
    const windowURL = window.location.pathname;
    const windowURLSplitted = windowURL.split("/");
    const staffLogoutKey = "place_id";
    const [defaultEventData, setDefaultEventData] = useState({
        topBarTitle: "",
        topBarTitle_en: "",
    });
    const allowedUserIconPaths = [
        "/user/dashboard",
        "/user/register/member",
        "/user/checkout",
        "/user/dashboard/",
        "/user/register/member/",
        "/user/checkout/",
        "/user/event/dashboard",
        "/user/event/register/member",
        "/user/event/checkout",
        "/user/event/dashboard/",
        "/user/event/register/member/",
        "/user/event/checkout/",
    ];

    const eventHeaderTextStaticPaths = [
        "/user/event-list",
        "/user/event-list/",
        "/user/dashboard",
        "/user/register/member",
        "/user/checkout",
        "/user/dashboard/",
        "/user/register/member/",
        "/user/checkout/",
        "/staff/login",
        "/staff/login/",
        "/staff/forgot-password",
        "/staff/forgot-password/",
        "/staff/reset-password",
        "/staff/reset-password/",
        "/staff/event-staff/dashboard",
        "/staff/event-staff/dashboard/",
        "/staff/event-staff/family",
        "/staff/event-staff/family/",
        "/staff/event-staff/family/family-detail",
        "/staff/event-staff/family/family-detail/",
        "/user/event/dashboard",
        "/user/event/register/member",
        "/user/event/checkout",
        "/user/event/dashboard/",
        "/user/event/register/member/",
        "/user/event/checkout/",
    ];
    const QrUrls = [
        "/user/qr/app",
        "/user/qr/app/",]

    const currentPath = window.location.pathname; // Assuming you are in a browser environment
    const [layoutInformation, setLayoutInformation] = useState(settings_data);

    // Helper function country template
    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div
                    className="flex align-items-center"
                    onClick={() => {
                        setLoader(true);
                        onChangeLocale(option.name === "日本語" ? "jp" : "en");
                    }}
                >
                    <img
                        alt={option.name}
                        src={option.image}
                        className={`mr-1 ${!userName ? "hidden" : "hidden"} ${!userName && allowedUserIconPaths.includes(currentPath)
                            ? "hidden"
                            : " "
                            }`}
                        style={{ width: "14px" }}
                    />
                    <i
                        className={`${userName ? "pr-1" : "pr-1"}`}
                        style={{ width: "14px" }}
                    >
                        <MdTranslate />
                    </i>
                    <div className={"pl-1"}>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    // Dynamic menu setting for top bar
    const settingView = (
        <Menu>
            {url.startsWith("/user") && !userName ? (
                <>
                    {locale == "en" ? (
                        <Menu.Item key="jp">
                            {selectedCountryTemplate({
                                name: "日本語",
                                code: "JP",
                                placeholder: "",
                                image: "/layout/images/jp.png",
                            })}
                        </Menu.Item>
                    ) : (
                        <Menu.Item key="en">
                            {selectedCountryTemplate({
                                name: "English",
                                code: "US",
                                placeholder: "",
                                image: "/layout/images/us.png",
                            })}
                        </Menu.Item>
                    )}

                    {allowedUserIconPaths.includes(currentPath) && (
                        <Menu.Item>
                            <div
                                className="flex justify-content-end clickable-row pr-2"
                                onClick={() => {
                                    if (_.isNull(AuthenticationAuthorizationService.staffValue)) {
                                        router.push({
                                            pathname: "/staff/login",
                                        });
                                    } else {
                                        router.push({
                                            pathname: "/staff/family",
                                        });
                                    } 
                                    // else {
                                    //     router.push({
                                    //         pathname: "/staff/event-staff/dashboard",
                                    //     });
                                    // }
                                }}
                            >
                                <i className="pr-1">
                                    <TbUserCog />
                                </i>
                                {translate(localeJson, "go_to_staff_screen")}
                            </div>
                        </Menu.Item>
                    )}
                </>
            ) : userName ? (
                <>
                    {locale == "en" ? (
                        <Menu.Item key="jp">
                            {selectedCountryTemplate({
                                name: "日本語",
                                code: "JP",
                                placeholder: "",
                                image: "/layout/images/jp.png",
                            })}
                        </Menu.Item>
                    ) : (
                        <Menu.Item key="en">
                            {selectedCountryTemplate({
                                name: "English",
                                code: "US",
                                placeholder: "",
                                image: "/layout/images/us.png",
                            })}
                        </Menu.Item>
                    )}
                </>
            ) : (
                <>
                    {locale == "en" ? (
                        <Menu.Item key="jp">
                            {selectedCountryTemplate({
                                name: "日本語",
                                code: "JP",
                                placeholder: "",
                                image: "/layout/images/jp.png",
                            })}
                        </Menu.Item>
                    ) : (
                        <Menu.Item key="en">
                            {selectedCountryTemplate({
                                name: "English",
                                code: "US",
                                placeholder: "",
                                image: "/layout/images/us.png",
                            })}
                        </Menu.Item>
                    )}
                </>
            )}
            {url.startsWith("/admin") && userName && (
                <>
                    <Menu.Divider />
                    <Menu.Item
                        key="logout"
                        icon={<LogoutOutlined />}
                        onClick={() => logout("admin", {}, onLogoutSuccess)}
                    >
                        <div>{translate(localeJson, "logout")}</div>
                    </Menu.Item>
                </>
            )}
            {url.startsWith("/staff") && userName && (
                <>
                    <Menu.Divider />
                    <Menu.Item
                        key="logout"
                        icon={<LogoutOutlined />}
                        onClick={() => {
                            if (storeData.staffEditedStockpile.length > 0) {
                                let result = window.confirm(
                                    translate(localeJson, "alert_info_for_unsaved_contents")
                                );
                                if (result) {
                                    logout(
                                        "staff",
                                        {
                                            [staffLogoutKey]: localStorage.getItem("place_id"),
                                        },
                                        onLogoutSuccess,
                                        staffLogoutKey
                                    );
                                }
                            } else {
                                logout(
                                    "staff",
                                    {
                                        [staffLogoutKey]:  localStorage.getItem("place_id"),
                                    },
                                    onLogoutSuccess,
                                    staffLogoutKey
                                );
                            }
                        }}
                    >
                        <div>{translate(localeJson, "logout")}</div>
                    </Menu.Item>
                </>
            )}
            {url.startsWith("/hq-staff") && userName && (
                <>
                    <Menu.Divider />
                    <Menu.Item
                        key="logout"
                        icon={<LogoutOutlined />}
                        onClick={() => logout("headquaters", {}, onLogoutSuccess)}
                    >
                        <div>{translate(localeJson, "logout")}</div>
                    </Menu.Item>
                </>
            )}
        </Menu>
    );

    /* Services */
    const { logout } = AuthenticationAuthorizationService;
    const { getdefaultEventData } = TempRegisterServices;

    useEffect(() => {
        layoutUpdate(url);
        router.events.on("routeChangeComplete", (responseUrl) => {
            layoutUpdate(responseUrl);
        });
        const fetchData = async () => {
            await onGetTempRegisterDefaultEvent();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (settings_data) {
            setLayoutInformation(settings_data);
        }
    }, [settings_data]);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    /**
     * Layout update
     */
    const layoutUpdate = (responseUrl) => {
        const adminData = JSON.parse(localStorage.getItem("admin"));
        const staffData = JSON.parse(localStorage.getItem("staff"));
        const hqStaffData = JSON.parse(localStorage.getItem("hq-staff"));
        if (responseUrl.startsWith("/admin")) {
            setUserName(adminData?.user?.name);
        } else if (responseUrl.startsWith("/staff")) {
            setUserName(staffData?.user?.name);
        } else if (responseUrl.startsWith("/hq-staff")) {
            setUserName(hqStaffData?.user?.name);
        } else {
            setUserName("");
        }
    };

    /**
     * On password changed successfully
     * @param {*} response
     */
    const onChangePasswordSuccess = (response) => {
        setChangePasswordOpen(false);
    };

    /**
     * Logout success
     * @param key
     */
    const onLogoutSuccess = async (key) => {
        if (key === "admin") {
            dispatch(
                setAdminValue({
                    admin: {},
                })
            );
            localStorage.removeItem("admin");
            await router.push("/admin/login");
        } else if (key === "staff") {
            dispatch(
                setStaffValue({
                    staff: {},
                })
            );
            localStorage.removeItem("staff");
            if (staffLogoutKey === "place_id") {
                dispatch(setStaffEditedStockpile([]));
                await router.push("/staff/login");
            // } else {
            //     await router.push("/user/event-list");
            }
        } else if (key === "headquaters") {
            localStorage.removeItem("hq-staff");
            dispatch(
                setHeadquaterValue({
                    headquaters: {},
                })
            );
            await router.push("/hq-staff/login");
        }
    };

    const onGetTempRegisterDefaultEvent = () => {
        getdefaultEventData((response) => {
            if (response.success) {
                const data = response.data.model;
                if (data) {
                    setDefaultEventData({
                        topBarTitle: data.name,
                        topBarTitle_en: data.name_en,
                    });
                }
            }
        });
    };

    const checkAndRedirectToEntranceExitScreen = () => {
        let confirmUrl = [
            "/user/person-count",
            "/user/register/member",
            "/user/checkout",
            "/user/checkout/details",
            "/user/register/member/details/",
        ];
        let dashboardUrl = '/user/dashboard'
        let registerUrl = "/user/register";
        let qrUrl = '/user/qr/app';
        let qrUrl_ = '/user/qr/app/';
        console.log(windowURL,qrUrl)
        if (confirmUrl.includes(windowURL)) {
            router.push("/user/dashboard");
        } else if (windowURL == registerUrl) {
            let result = window.confirm(
                translate(localeJson, "do_you_want_to_return_to_main")
            );
            if (result) {
                router.push("/user/dashboard");
            }
        }
        else if (windowURL == dashboardUrl) {
            console.log('dashboardUrl',dashboardUrl)
            layoutReducer?.user?.place?.type == "place" ? router.push("/user/list") : router.push("/user/event-list")
        }
        else if (windowURL == qrUrl||windowURL == qrUrl_) {
            console.log('qrUrlddd',qrUrl)
            router.push("/user/qr/app/place-list");
        }
    };

    /**
     * Get place or event name from redux & display
     * @returns Name
     */
    const getSelectedUserPlaceOrEvent = () => {
        const URLS = [
            "/staff/login",
            "/staff/login/",
            "/staff/forgot-password",
            "/staff/forgot-password/",
            "/staff/reset-password",
            "/staff/reset-password/",
        ];
        if (window.location.pathname.startsWith("/staff")) {
            if (
                !URLS.includes(path) &&
                window.location.pathname.startsWith("/staff/event-staff")
            ) {
                return (
                    <div className="header-details-first text-sm">
                        {`${locale === "en" 
                            ? localStorage.getItem("evacuationPlaceNameEnglish") 
                            : localStorage.getItem("evacuationPlaceName")
                            }`}
                    </div>
                );
            } else {
                if (!URLS.includes(path)) {
                    return (
                        <div className="header-details-first text-sm">
                            {`${locale === "en" &&
                                !_.isNull(layoutReducer?.user?.place?.name_en)
                                ? layoutReducer?.user?.place?.name_en
                                : layoutReducer?.user?.place?.name
                                }`}
                        </div>
                    );
                }
            }
        }
    };

    /**
     * App top bar right functionality
     */
    const topBarRight = (
        <div ref={topbarmenuRef} className="header-details-second">
        <div className='header-details-second-date-time-picker mr-3'>
            <DateTimeDisplay/>
            </div>
            {userName && (
                <div title={userName} className="header-dropdown-name">
                    <label className="text-base font-bold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                        {userName}
                    </label>
                </div>
            )}
            {!userName && !allowedUserIconPaths.includes(currentPath) && (
                <div className="pr-3">
                    <DropdownSelect
                        icon={<i className="pi pi-bars" />}
                        items={settingView}
                        name="topbar-menu"
                    />
                </div>
            )}
            {userName &&
                windowURLSplitted &&
                !urlRegister.includes(windowURLSplitted[2]) && !urlRegister.includes(windowURLSplitted[1]) ? (
                <div className={`${!userName ? "pr-3" : ""}`}>
                    <DropdownSelect
                        icon={<i className="pi pi-cog" />}
                        items={settingView}
                    />
                </div>
            ) : !userName && allowedUserIconPaths.includes(currentPath) ? (
                <div className="pr-3">
                    <DropdownSelect
                        icon={<i className="pi pi-bars" />}
                        items={settingView}
                        name="topbar-menu"
                    />
                </div>
            ) : (
                <></>
            )}
        </div>
    );


    return (
        <React.Fragment>
            <div className="header-container">
            <div className={`layout-topbar ${QrUrls.includes(currentPath)?"hover-content":""}`}>
                {layoutConfig.menuMode === "static" &&
                    !windowURL.startsWith("/user/map") && (
                        <div className="logo-details">
                            <div className="logo-view cursor-pointer">
                                {layoutConfig.menuMode === "static" && (
                                    <div className="hamburger px-2">
                                        <button
                                            ref={menubuttonRef}
                                            type="button"
                                            className="p-link layout-topbar-button"
                                            onClick={onMenuToggle}
                                            aria-label="hamburger menu toggle"
                                        >
                                            <i className="pi pi-bars" />
                                        </button>
                                    </div>
                                )}
                                <ImageComponent
                                    imageProps={{
                                        src: layoutInformation?.image_logo_path
                                            ? layoutInformation?.image_logo_path
                                            : ``,
                                        width: 220,
                                        height: 45,
                                        alt: "logo",
                                        text:"テレネット",
                                        onClick: () => {
                                            if (
                                                url.startsWith("/staff") 
                                            ) {
                                                router.push("/staff/family");
                                            } else if (url.startsWith("/hq-staff")) {
                                                router.push("/hq-staff/dashboard");
                                            } else {
                                                router.push("/admin/dashboard");
                                            }
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    )}
                <div
                    className={`header-details`}
                    style={{
                        width:
                            (layoutConfig.menuMode === "overlay" ||
                                windowURL.startsWith("/user/map")) &&
                            "100%",
                    }}
                >
                    {layoutConfig.menuMode === "static" && (
                        <div className="hamburger">
                            <button
                                ref={menubuttonRef}
                                type="button"
                                className="p-link layout-topbar-button"
                                onClick={onMenuToggle}
                                aria-label="hamburger menu toggle"
                            >
                                <i className="pi pi-bars" />
                            </button>
                        </div>
                    )}
                    <div
                        className={`header-details-first-view ${!userName ? "pr-0" : ""}`}
                    >
                        {windowURLSplitted &&
                            !urlRegister.includes(windowURLSplitted[2]) && !urlRegister.includes(windowURLSplitted[1]) ? (
                            <div
                                title={
                                    locale == "ja"
                                        ? settings_data?.system_name_ja
                                        : settings_data?.system_name_en
                                }
                                className="header-details-first flex flex-column"
                            >
                                <div
                                    className={`text-base white-space-nowrap overflow-hidden text-overflow-ellipsis cursor-pointer`}
                                    onClick={checkAndRedirectToEntranceExitScreen}
                                >
                                    {layoutReducer?.user?.place?.type === "event" &&
                                        eventHeaderTextStaticPaths.includes(currentPath) || window.location.pathname.startsWith("/user/event-list")
                                        ? translate(localeJson, "event_management_system")
                                        : locale === "ja"
                                            ? settings_data?.system_name_ja
                                            : settings_data?.system_name_en}
                                </div>
                                {getSelectedUserPlaceOrEvent()}
                            </div>
                        ) : (
                            <div
                                title={
                                    locale == "ja"
                                        ? defaultEventData.topBarTitle
                                        : defaultEventData.topBarTitle_en
                                }
                                className="header-details-first"
                            >
                                {window.location.pathname.startsWith("/privacy") ? (
                                    <>
                                        {translate(localeJson, "privacy_policy")}
                                    </>
                                ) : (
                                    <>
                                        {(locale == "ja"
                                            ? defaultEventData.topBarTitle
                                            : defaultEventData.topBarTitle_en) +
                                            (windowURLSplitted[2] == "pre-register"
                                                ? " " + translate(localeJson, "pre_registration")
                                                : "")}
                                    </>
                                )}
                            </div>
                        )}
                        {topBarRight}
                    </div>
                </div>
            </div>
            </div>
        </React.Fragment>
    );
});

AppTopbar.displayName = "AppTopbar";
export default AppTopbar;
