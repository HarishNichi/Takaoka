/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect,useContext } from "react";
import { DataTable as TableData } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";

// Utility to render a cell as th if rowHeader is set
const renderCell = (col, rowData, rowIndex) => {
  if (col.rowHeader) {
    return (
      <th scope="row" tabIndex={0} aria-label={col.header} className={col.className} style={col.style} key={col.field || rowIndex}>
        {col.body ? col.body(rowData, { rowIndex }) : rowData[col.field]}
      </th>
    );
  }
  else {
  return (
    <td
      className={col.className}
      scope="col"
      style={col.style}
      key={col.field || rowIndex}
      tabIndex={0}
      aria-label={col.header}
    >
      {col.body ? col.body(rowData, { rowIndex }) : rowData[col.field]}
    </td>
  );
  }
};

export const NormalTable = React.memo((props) => {
  const {
    parentClass,
    paginator,
    rows,
    value,
    customActionsField,
    customBody,
    columns,
    id,
    rowClassName,
    filterDisplay,
    style,
    size,
    frozenValue,
    stripedRows,
    emptyMessage,
    tableStyle,
    responsiveLayout,
    columnStyle,
    rowsPerPageOptions,
    showGridlines,
    className,
    onRowClick,
    paginatorClassName,
    paginatorLeft,
    paginatorRight,
    alignHeader,
    expander,
    rowExpansionTemplate,
    expandedRows,
    onRowToggle,
    selectedCell,
    cellClassName,
    isDataSelectable,
    onPageHandler,
    selectionMode,
    selection,
    onSelectionChange,
    editMode,
    onRowEditComplete,
    ...restProps
  } = props;
  const { locale, localeJson, setLoader } = useContext(LayoutContext);

  /** Custom pagination template */
    const paginatorTemplate = {
    layout:
      "RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: `10件`, value: 10 },
        { label: `20件`, value: 20 },
        { label: `50件`, value: 50 },
      ];

      const INPUT_ID = 'rowsPerPageDropdown';

      return (
        <React.Fragment>
             {/* Invisible label satisfies WCAG "select-name" rule */}
        <label id={INPUT_ID} htmlFor={INPUT_ID} className="sr-only">
          {translate(localeJson, "rows_per_page")}
        </label>
          <Dropdown
           inputId={INPUT_ID}   
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
            ariaLabel={translate(localeJson, "rows_per_page")}
            ariaLabelledBy={translate(localeJson, "rows_per_page")}
            title={translate(localeJson, "rows_per_page")}
            placeholder="Rows per page"
             pt={{
          select: { 'aria-label': 'Rows per page' } // or role: 'presentation'
        }}
          />
        </React.Fragment>
      );
    },
  };

  const combinedData = frozenValue ? _.cloneDeep(...frozenValue) : {};

  return (
    <div className={`${parentClass || "custom-table w-full"}`}>
      <TableData
        id={id}
        value={value}
        className={`${className}`}
        expandedRows={expandedRows}
        paginator={paginator}
        rows={rows || 10}
        rowsPerPageOptions={[10, 15, 20]}
        rowClassName={rowClassName}
        filterDisplay={filterDisplay}
        emptyMessage={emptyMessage}
        style={style}
        size={size}
        onRowClick={onRowClick}
        onRowToggle={onRowToggle}
        showGridlines={false}
        stripedRows={false}
        selectionMode={selectionMode}
        selection={selection}
        onSelectionChange={onSelectionChange}
        responsiveLayout={responsiveLayout}
        editMode={editMode}
        onRowEditComplete={onRowEditComplete}
        tableStyle={tableStyle || { minWidth: "50rem" }}
        paginatorClassName={paginatorClassName}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        rowExpansionTemplate={rowExpansionTemplate}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate="{totalRecords}"
        cellClassName={cellClassName}
        isDataSelectable={isDataSelectable}
        // sortIcon={<i className="pi pi-check" />}
        onPage={_.isFunction(onPageHandler) ? (e) => onPageHandler(e) : false}
        {...restProps}
      >
        {columns.map((col, index) => {
          // Only the first column is rowHeader by default, others are not
          const colWithRowHeader = { ...col, rowHeader: col.rowHeader !== undefined ? col.rowHeader : index === 0 };
          return (
            <Column
              key={index}
              aria-label={typeof colWithRowHeader.value === 'string' ? colWithRowHeader.value : colWithRowHeader.header || ''}
              tabIndex={index}
              field={colWithRowHeader.field}
              selectionMode={colWithRowHeader.selectionMode}
              rowEditor={colWithRowHeader.rowEditor}
              editor={colWithRowHeader.editor}
              header={
                <span>
                  {colWithRowHeader.header}
                  {colWithRowHeader.required && <span className="p-error">*</span>}
                </span>
              }
              sortable={colWithRowHeader.sortable}
              headerStyle={colWithRowHeader.headerStyle}
              alignHeader={colWithRowHeader.alignHeader}
              className={colWithRowHeader.className}
              headerClassName={colWithRowHeader.headerClassName}
              footer={
                frozenValue &&
                Object.prototype.hasOwnProperty.call(combinedData, colWithRowHeader.field) && (
                  <span>{combinedData[colWithRowHeader.field]}</span>
                )
              }
              style={{
                minWidth: colWithRowHeader.minWidth && colWithRowHeader.minWidth,
                maxWidth: colWithRowHeader.maxWidth && colWithRowHeader.maxWidth,
                width: colWithRowHeader.width && colWithRowHeader.width,
                ...columnStyle,
                textAlign: colWithRowHeader.textAlign && colWithRowHeader.textAlign,
                fontWeight: colWithRowHeader.fontWeight && colWithRowHeader.fontWeight,
                display: colWithRowHeader.display,
                wordWrap: "break-word",
              }}
              body={(rowData, options) =>
                renderCell(colWithRowHeader, rowData, options.rowIndex)
              }
            />
          );
        })}
      </TableData>
    </div>
  );
});
NormalTable.displayName = 'NormalTable';

export const RowExpansionTable = React.memo((props) => {
  const {
    parentClass,
    custom,
    rowExpansionField,
    outerColumn,
    innerColumn,
    inner1Column,
    innerColumn1,
    value,
    id,
    paginator,
    rows,
    rowClassName,
    filterDisplay,
    style,
    size,
    stripedRows,
    paginatorLeft,
    paginatorRight,
    emptyMessage,
    tableStyle,
    rowExpansionStyle,
    rowExpansionTableStyle,
    rowExpansionSize,
    responsiveLayout,
    columnStyle,
    rowExpansionColumnStyle,
    rowsPerPageOptions,
    showGridlines,
    rowExpanisonGridlines,
    className,
    rowExpansionClassName,
    rowExpansionOnRowClick,
    onRowClick,
    expandAllButtonProps,
    onRowExpand,
    defaultIndex,
    expandAllRows,
    collapseAllRows,
    rowExpansionEmptyMessage,
    iconHeaderStyle,
    iconStyle,
    selectionMode,
    innerTableSelectionMode,
    innerTableOnSelectionChange,
    innerTableSelection,
    innerTableSelectAll,
    innerTableOnSelectAllChange,
    ...restProps
  } = props;
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [expandedRows, setExpandedRows] = useState(onRowExpand);
  const toast = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (value && expandAllRows === true) {
      let _expandedRows = {};
      value.forEach((p) => (_expandedRows[`${p.id}`] = true));
      setExpandedRows(_expandedRows);
    }
    if (value && collapseAllRows === true) {
      collapseAll();
    }
  }, [value]);

  const expandAll = () => {
    let _expandedRows = {};
    value.forEach((p) => (_expandedRows[`${p.id}`] = true));
    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const allowExpansion = (rowData) => {
    return rowData[rowExpansionField] && rowData[rowExpansionField].length > 0;
  };
  const allowQuesExpansion = (rowData) => {
    return (
      rowData[rowExpansionField] &&
      rowData[rowExpansionField].length > 0 &&
      rowData[rowExpansionField][0].is_default == 1
    );
  };

  const rowExpansionTemplate = (data, val) => {
    return (
      <div className="rowExpansionTable">
        <TableData
          className={`${rowExpansionClassName}`}
          id={id}
          showGridlines={false}
          onRowClick={rowExpansionOnRowClick}
          value={data[rowExpansionField]}
          size={rowExpansionSize}
          style={rowExpansionStyle}
          emptyMessage={rowExpansionEmptyMessage}
          selectionMode={innerTableSelectionMode}
          tableStyle={rowExpansionTableStyle || { minWidth: "20rem" }}
          selection={innerTableSelection}
          onSelectionChange={(e) =>
            innerTableOnSelectionChange(e, data, val.index)
          }
        >
          {innerColumn.map((column, index) => (
            <Column
              key={index}
              field={column.field}
              header={
                <span>
                  {column.header}
                  {column.required && <span className="p-error">*</span>}
                </span>
              }
              sortable={column.sortable}
              className={column.className}
              alignHeader={column.alignHeader}
              headerClassName={column.headerClassName}
              selectionMode={column.selectionMode}
              style={{
                minWidth: column.minWidth && column.minWidth,
                maxWidth: column.maxWidth && column.maxWidth,
                display: column.display,
                textAlign: column.textAlign && column.textAlign,
                wordWrap: "break-word",
                ...rowExpansionColumnStyle,
              }}
              headerStyle={column.headerStyle}
              body={
                column.field === props.customRowExpansionActionsField
                  ? column.body
                  : column.body
              }
            />
          ))}
        </TableData>
        {inner1Column && inner1Column.length > 0 && (
          <TableData
            className={`${rowExpansionClassName}`}
            id={id}
            showGridlines={false}
            onRowClick={rowExpansionOnRowClick}
            value={data[rowExpansionField]}
            size={rowExpansionSize}
            style={rowExpansionStyle}
            emptyMessage={rowExpansionEmptyMessage}
            selectionMode={innerTableSelectionMode}
            tableStyle={rowExpansionTableStyle || { minWidth: "20rem" }}
            onSelectionChange={innerTableOnSelectionChange}
          >
            {inner1Column.map((column1, index) => (
              <Column
                key={index}
                field={column1.field}
                header={
                  <span>
                    {column1.header}
                    {column1.required && <span className="p-error">*</span>}
                  </span>
                }
                sortable={column1.sortable}
                className={column1.className}
                alignHeader={column1.alignHeader}
                headerClassName={column1.headerClassName}
                selectionMode={column1.selectionMode}
                style={{
                  minWidth: column1.minWidth && column1.minWidth,
                  textAlign: column1.textAlign && column1.textAlign,
                  wordWrap: "break-word",
                  ...rowExpansionColumnStyle,
                }}
                headerStyle={column1.headerStyle}
                body={
                  column1.field === props.customRowExpansionActionsField
                    ? column1.body
                    : column1.body
                }
              />
            ))}
          </TableData>
        )}
      </div>
    );
  };

  /** Custom pagination template */
  const paginatorTemplate = {
    layout:
      "RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: `10件`, value: 10 },
        { label: `20件`, value: 20 },
        { label: `50件`, value: 50 },
      ];

      const INPUT_ID = 'rowsPerPageDropdown';

      return (
        <React.Fragment>
             {/* Invisible label satisfies WCAG "select-name" rule */}
        <label id={INPUT_ID} htmlFor={INPUT_ID} className="sr-only">
          {translate(localeJson, "rows_per_page")}
        </label>
          <Dropdown
           inputId={INPUT_ID}   
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
            ariaLabel={translate(localeJson, "rows_per_page")}
            ariaLabelledBy={translate(localeJson, "rows_per_page")}
            title={translate(localeJson, "rows_per_page")}
            placeholder="Rows per page"
             pt={{
          select: { 'aria-label': 'Rows per page' } // or role: 'presentation'
        }}
          />
        </React.Fragment>
      );
    },
  };

  return (
    <div className={`${parentClass} ${custom || "custom-table"}`}>
      <Toast ref={toast} />
      <TableData
        paginator={paginator}
        paginatorTemplate={paginator ? paginatorTemplate : ""}
        currentPageReportTemplate="{totalRecords}"
        rows={rows || 10}
        className={`${className}`}
        value={props.value}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={expandAllButtonProps}
        rowClassName={rowClassName}
        filterDisplay={filterDisplay}
        emptyMessage={emptyMessage}
        style={style}
        size={size}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        stripedRows={false}
        showGridlines={false}
        onRowClick={onRowClick}
        responsiveLayout={responsiveLayout}
        rowsPerPageOptions={[10, 25, 50]}
        tableStyle={tableStyle || { minWidth: "50rem" }}
        {...restProps}
      >
        {outerColumn.map((col, index) => {
          // Only the first column is rowHeader by default, others are not
          const colWithRowHeader = { ...col, rowHeader: col.rowHeader !== undefined ? col.rowHeader : index === 0 };
          return (
            <Column
              key={index}
              field={colWithRowHeader.field}
              header={
                <span>
                  {colWithRowHeader.header}
                  {colWithRowHeader.required && <span className="p-error">*</span>}
                </span>
              }
              sortable={colWithRowHeader.sortable}
              expander={colWithRowHeader.expander}
              className={colWithRowHeader.className}
              alignHeader={colWithRowHeader.alignHeader}
              headerStyle={colWithRowHeader.headerStyle}
              headerClassName={colWithRowHeader.headerClassName}
              style={{
                minWidth: colWithRowHeader.minWidth && colWithRowHeader.minWidth,
                maxWidth: colWithRowHeader.maxWidth && colWithRowHeader.maxWidth,
                display: colWithRowHeader.display,
                textAlign: colWithRowHeader.textAlign && colWithRowHeader.textAlign,
                paddingLeft: colWithRowHeader.paddingLeft,
                wordWrap: "break-word",
                ...columnStyle,
              }}
              body={colWithRowHeader.field === props.customActionsField ? colWithRowHeader.body : colWithRowHeader.body}
            />
          );
        })}
        <Column
          expander={defaultIndex ? allowQuesExpansion : allowExpansion}
          headerStyle={iconHeaderStyle}
          style={{ width: "5rem", textAlign: "left", ...iconStyle }}
        />
      </TableData>
    </div>
  );
});
RowExpansionTable.displayName = 'RowExpansionTable';
