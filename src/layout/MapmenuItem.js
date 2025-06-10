import React, { useEffect, useContext, useRef, useState } from 'react';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { Tooltip } from 'primereact/tooltip';

import { MenuContext } from '@/layout/context/menucontext';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useAppDispatch } from '@/redux/hooks';
import { setPosition } from '@/redux/layout';

const MapMenuitem = (props) => {
  const { layoutConfig, layoutState, onMenuToggle } = useContext(LayoutContext);
  const { activeMenu, setActiveMenu } = useContext(MenuContext);
  const [activePosition, setActivePosition] = useState(null);
  const dispatch = useAppDispatch();
  const items = props.item.items;
  const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
  const active = activeMenu === key || activeMenu.startsWith(key + '-');
  const menuRef = useRef(null);
  const [isPageLoad, setIsPageLoad] = useState(false)

  useEffect(() => {
    // Example logic to update activePosition, replace this with your own logic
    // For demonstration, it's using the first item's position
    if (props.index === 0 && props.item.position) {
      setActivePosition(props.item.position);
      setActiveMenu(key);
    }
  }, [props?.item?.position]);

  const itemClick = (event, placeData) => {
    setActivePosition(placeData);
    setIsPageLoad(true)
    dispatch(setPosition(placeData));
    // Avoid processing disabled items
    if (props.item.disabled) {
      event.preventDefault();
      return;
    }
    // Execute command
    if (props.item.command) {
      props.item.command({ originalEvent: event, item: props.item });
    }
    // Toggle active state
    if (props.item.items) {
      setActiveMenu(active ? props.parentKey : key);
    } else {
      setActiveMenu(key);
      if (window.innerWidth <= 768) {
        onMenuToggle()
      }
    }
  };

  const subMenu = Array.isArray(items) && items.length > 0 && props.item.visible !== false && (
    <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={props.item.label}>
      <ul>
        {items.map((child, i) => {
          return <MapMenuitem
            key={i}
            item={child}
            index={i}
            parentKey={key}
          />
        }
        )}
      </ul>
    </CSSTransition>
  );

  return (
    <React.Fragment>
      {layoutState.staticMenuDesktopInactive &&
        layoutConfig.menuMode === "static" && (
          <Tooltip
            target={menuRef.current}
            position="right"
            className="sidebar-custom-tooltip"
          />
        )}
      <li
        className={classNames(props.item.class, {
          "layout-root-menuitem": props.root,
        })}
      >
        {props.root && props.item.visible !== false && (
          <div className="layout-menuitem-root-text">
            <span className='layout-menuitem-root-text-icon'>
              {props.item.icon}
            </span>
            <span>{props.item.label}</span>
          </div>
        )}
        {(!props.item.items) ? (
          <a
            ref={menuRef}
            data-pr-tooltip={props.item.label}
            onClick={(e) => !props.item.items && itemClick(e, props?.item?.position)}
            className={classNames(
              {
                'active-route': (active && !props.item.items && isPageLoad)
              },
              props.item.class,
              "p-ripple",
              "active-parent-menu"
            )}
            tabIndex="0"
          >
            <span className="layout-menuitem-text">{props.item.label}</span>
            <Ripple />
          </a>
        ) : null}
        {subMenu}
      </li>
    </React.Fragment>
  );
};

export default MapMenuitem;


