import React, { useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { Tooltip } from 'primereact/tooltip';
import { useSelector } from 'react-redux';

import { setStaffEditedStockpile } from "@/redux/stockpile";
import { useAppDispatch } from "@/redux/hooks";
import { MenuContext } from '@/layout/context/menucontext';
import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';

const AppMenuitem = (props) => {
    const { layoutConfig, layoutState, localeJson, locale } = useContext(LayoutContext);
    const router = useRouter();
    const storeData = useSelector((state) => state.stockpileReducer);
    const dispatch = useAppDispatch();

    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item.to && router.pathname === item.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');
    const menuRef = useRef(null);

    useEffect(() => {
        // Reset active menu status
        setActiveMenu("");
        if (item.to && router.pathname === item.to) {
            setActiveMenu(key);
        }
        const onRouteChange = (url) => {
            if (item.to && item.to === url) {
                setActiveMenu(key);
            }
        };
        router.events.on('routeChangeComplete', onRouteChange);
        return () => {
            router.events.off('routeChangeComplete', onRouteChange);
        };
    }, [locale]);

    const itemClick = (event) => {
        // Avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        // Execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }
        // Toggle active state
        if (item.items) {
            setActiveMenu(active ? props.parentKey : key);
        } else {
            if (storeData.staffEditedStockpile.length > 0) {
                let result = window.confirm(translate(localeJson, 'alert_info_for_unsaved_contents'));
                if (result) {
                    setActiveMenu(key);
                    dispatch(setStaffEditedStockpile([]));
                }
                else {
                    event.preventDefault();
                    return;
                }
            }
            else {
                setActiveMenu(key);
            }
        }
    };

    const subMenu = item.items && item.visible !== false && (
        <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={item.label}>
            <ul>
                {item.items.map((child, i) => {
                    return (
                        <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />
                    )
                })}
            </ul>
        </CSSTransition>
    );

    return (
        <React.Fragment>
            {layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static' && (
                <Tooltip target={menuRef.current} position="right" className="sidebar-custom-tooltip" />
            )}
            <li className={classNames(item.class, { 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
                {props.root && item.visible !== false && (
                    !item.top ? (
                        <div className="layout-menuitem-root-text">
                            <span className='layout-menuitem-root-text-icon'>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </div>
                    ) : (
                        <Link ref={menuRef} data-pr-tooltip={item.label} href={item.to} replace={item.replaceUrl} target={item.target} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple', { 'active-route': isActiveRoute })}>
                            <span className="layout-menuitem-text">{item.label}</span>
                            <Ripple />
                        </Link>
                    )
                )}

                {!item.top && item.to && !item.items && item.visible !== false ? (
                    <Link ref={menuRef} data-pr-tooltip={item.label} href={item.to} replace={item.replaceUrl} target={item.target} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple', { 'active-route': isActiveRoute && item.label != translate(localeJson, 'staff_dashboard') }, { 'active-parent-menu': item.label == translate(localeJson, 'staff_dashboard') })} tabIndex={0}>
                        <span className="layout-menuitem-text">{item.label}</span>
                        {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                        <Ripple />
                    </Link>
                ) : null}

                {subMenu}
            </li>
        </React.Fragment>
    );
};

export default AppMenuitem;