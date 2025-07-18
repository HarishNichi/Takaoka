import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { MdManageAccounts, MdSettings } from "react-icons/md";
import { BiQrScan } from "react-icons/bi";
import { RiHome5Fill, RiFileHistoryFill, RiFileSettingsFill } from "react-icons/ri";
import { IoMdListBox } from "react-icons/io";
import { PiUserListFill } from "react-icons/pi";
import { FaPeopleGroup, FaUsersGear } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi2";
import { FaUserTie } from "react-icons/fa"
import { BsHouseGearFill, BsPeopleFill } from "react-icons/bs";

import AppMenuitem from '@/layout/AppMenuitem';
import MapMenuitem from '@/layout/MapmenuItem';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { MenuProvider } from '@/layout/context/menucontext';
import { getValueByKeyRecursively as translate } from '@/helper';
import { useAppSelector } from "@/redux/hooks";

const AppMenu = () => {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const url = window.location.pathname;
    // Getting storage data with help of reducers
    const layoutReducer = useAppSelector((state) => state.layoutReducer);

    // Admin side bar information
    const adminModel = [
        {
            label: translate(localeJson, 'vault_info'),
            icon: <RiHome5Fill size={16} />,
            items: [
                {
                    label: translate(localeJson, 'evacuation_status_list'),
                    icon: <IoMdListBox size={16} />,
                    to: '/admin/dashboard',
                    active: router.pathname.startsWith('/admin/dashboard')
                },
                {
                    label: translate(localeJson, 'history_place'),
                    icon: <RiFileHistoryFill size={16} />,
                    to: '/admin/history/place',
                    active: router.pathname.startsWith('/admin/history/place'),
                },
                {
                    label: translate(localeJson, 'list_of_evacuees_menu'),
                    icon: <PiUserListFill size={16} />,
                    to: '/admin/evacuation',
                    active: router.pathname.startsWith('/admin/evacuation')
                },
                {
                    label: translate(localeJson, 'employee_list'),
                    icon: <PiUserListFill size={16} />,
                    to: '/admin/employee/list',
                    active: router.pathname.startsWith('/admin/employee/list')
                },
            ]
        },
        {
            label: translate(localeJson, 'operation_management'),
            icon: <MdManageAccounts size={16} />,
            items: [
                {
                    label: translate(localeJson, 'qr_code_create'),
                    icon: <BiQrScan size={16} />,
                    to: '/admin/qrcode/csv/import',
                    active: router.pathname.startsWith('/admin/qrcode/csv/import')
                },
                {
                    label: translate(localeJson, 'staff_management'),
                    icon: <FaUsersGear size={16} />,
                    to: '/admin/staff-management',
                    active: router.pathname.startsWith('/admin/staff-management')
                },
                {
                    label: translate(localeJson, 'headquarters_staff_management'),
                    icon: <FaUsersGear size={16} />,
                    to: '/admin/hq-staff-management',
                    active: router.pathname.startsWith('/admin/hq-staff-management')
                },
                {
                    label: translate(localeJson, 'admin_management'),
                    icon: <FaUserTie size={16} />,
                    to: '/admin/admin-management',
                    active: router.pathname.startsWith('/admin/admin-management')
                },
                {
                    label: translate(localeJson, 'department_management'),
                    icon: <FaUserTie size={16} />,
                    to: '/admin/department-management',
                    active: router.pathname.startsWith('/admin/department-management')
                },

            ]
        },
        {
            label: translate(localeJson, 'setting'),
            icon: <MdSettings size={16} />,
            items: [
                {
                    label: translate(localeJson, 'places'),
                    icon: <BsHouseGearFill size={16} />,
                    to: '/admin/place',
                    active: router.pathname.startsWith('/admin/place'),
                }, {
                    label: translate(localeJson, 'setting_systems'),
                    icon: <RiFileSettingsFill size={16} />,
                    to: '/admin/setting',
                    active: router.pathname.startsWith('/admin/setting')
                },
            ]
        },
    ];
    // Staff(Place) side bar information
    const staffModel = [
        // {
        //     label: translate(localeJson, 'top_page'),
        //     icon: <MdSpaceDashboard size={16} />,
        //     to: '/staff/dashboard',
        //     top: true,
        //     class: "top-element",
        //     active: router.pathname.startsWith('/staff/dashboard')
        // },
        {
            label: translate(localeJson, 'evacuee_information'),
            icon: <HiInformationCircle size={16} />,
            items: [
                {
                    label: translate(localeJson, 'list_of_evacuees'),
                    icon: <BsPeopleFill size={16} />,
                    to: '/staff/family',
                    active: router.pathname.startsWith('/staff/family')
                },
                {
                    label: translate(localeJson, 'employee_list'),
                    icon: <PiUserListFill size={16} />,
                    to: '/staff/employee/list',
                    active: router.pathname.startsWith('/staff/employee/list')
                },
                   {
                    label: translate(localeJson, 'qr_scan'),
                    icon: <FaPeopleGroup size={16} />,
                    to: '/staff/qr',
                    active: router.pathname.startsWith('/staff/qr')
                },
            ]
        },
    ];

    // HQ side bar information
    const hqModel = [
        {
            label: translate(localeJson, 'vault_info'),
            icon: <RiHome5Fill size={16} />,
            class: "without-top-element",
            items: [
                {
                    label: translate(localeJson, 'evacuation_status_list'),
                    icon: <IoMdListBox size={16} />,
                    to: '/hq-staff/dashboard',
                    active: router.pathname.startsWith('/hq-staff/dashboard')
                },
                {
                    label: translate(localeJson, 'history_place'),
                    icon: <RiFileHistoryFill size={16} />,
                    to: '/hq-staff/history/place',
                    active: router.pathname.startsWith('/hq-staff/history/place'),
                },
                {
                    label: translate(localeJson, 'list_of_evacuees'),
                    icon: <PiUserListFill size={16} />,
                    to: '/hq-staff/evacuation',
                    active: router.pathname.startsWith('/hq-staff/evacuation')
                },
                {
                    label: translate(localeJson, 'employee_list'),
                    icon: <PiUserListFill size={16} />,
                    to: '/hq-staff/employee/list',
                    active: router.pathname.startsWith('/hq-staff/employee/list')
                },
            ]
        },
        {
            label: translate(localeJson, 'setting'),
            icon: <MdSettings size={16} />,
            items: [
                {
                    label: translate(localeJson, 'places'),
                    icon: <BsHouseGearFill size={16} />,
                    to: '/hq-staff/place',
                    active: router.pathname.startsWith('/hq-staff/place'),
                },

            ]
        },
    ]
    // Map side bar information
    const mapModel = [
        {
            label: translate(localeJson, "evacuation_place_list"),
            icon: <RiHome5Fill size={16} />,
            items: getMapItems(),
            isParent: true,
            class: "without-top-element",
        },
    ];
    function getMapItems() {
        let mapData = Array.isArray(layoutReducer?.places) ? layoutReducer.places.map((item, index) => ({
            label: item.content,
            position: item.position,
            onClick: () => { }, // Replace with your click handler function
        })) : [];
        return mapData
    }

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {
                    url.startsWith('/user/map') ? (
                        mapModel?.map((item, i) => {
                            return !item.seperator ? <MapMenuitem item={item} root={true} index={i} key={i} /> : <li className="menu-separator"></li>;
                        })
                    ) :
                        url.startsWith('/admin') ? (
                            adminModel.map((item, i) => {
                                return !item.seperator ? <AppMenuitem item={item} root={true} active={item.active} index={i} key={i} /> : <li className="menu-separator"></li>;
                            })
                        ) : url.startsWith('/staff') ? ( (
                                staffModel.map((item, i) => {
                                    return !item.seperator ? <AppMenuitem item={item} root={true} active={item.active} index={i} key={i} /> : <li className="menu-separator"></li>;
                                })
                            ) 
                        ) :
                            (
                                hqModel.map((item, i) => {
                                    return !item.seperator ? <AppMenuitem item={item} root={true} active={item.active} index={i} key={i} /> : <li className="menu-separator"></li>;
                                })
                            )}
            </ul>
            {/* {url.startsWith('/staff') && (layoutReducer?.user?.place?.type === "place" || layoutReducer?.user?.place?.type == "event") &&
                <div className='sidebar-bottom-fixed-view pt-1 px-3 bottom-0 fixed'>
                    <Button buttonProps={{
                        buttonClass: "w-auto back-button-transparent mb-2 p-0",
                        text: layoutReducer?.user?.place?.type === "place" ? translate(localeJson, "return_to_entrance_exit_screen") : translate(localeJson, "return_to_entrance_exit_screen_event"),
                        icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                        onClick: () => {
                            if (layoutReducer?.user?.place?.type === "place") {
                                router.replace('/user/dashboard')
                            } else {
                                router.replace('/user/event/dashboard')
                            }
                        },
                    }} parentClass={"back-button-transparent"} />
                </div>
            } */}
        </MenuProvider>
    );
};

export default AppMenu;
