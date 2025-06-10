import React, { useState, useRef, useEffect } from "react";
import { DataTable as TableData } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

export const NormalTable = (props) => {
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

      return (
        <React.Fragment>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
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
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            selectionMode={col.selectionMode}
            rowEditor={col.rowEditor}
            editor={col.editor}
            header={
              <span>
                {col.header}
                {col.required && <span className="p-error">*</span>}
              </span>
            }
            sortable={col.sortable}
            headerStyle={col.headerStyle}
            alignHeader={col.alignHeader}
            className={col.className}
            headerClassName={col.headerClassName}
            footer={
              frozenValue &&
              Object.prototype.hasOwnProperty.call(combinedData, col.field) && (
                <span>{combinedData[col.field]}</span>
              )
            }
            style={{
              minWidth: col.minWidth && col.minWidth,
              maxWidth: col.maxWidth && col.maxWidth,
              width: col.width && col.width,
              ...columnStyle,
              textAlign: col.textAlign && col.textAlign,
              fontWeight: col.fontWeight && col.fontWeight,
              display: col.display,
              wordWrap: "break-word",
            }}
            body={col.field === customActionsField ? col.body : col.body}
          />
        ))}
      </TableData>
    </div>
  );
};

export const RowExpansionTable = (props) => {
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
  const [expandedRows, setExpandedRows] = useState(onRowExpand);
  const toast = useRef(null);

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
          onSelectionChange={(e) => innerTableOnSelectionChange(e, data, val.index)}
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

      return (
        <React.Fragment>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
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
        {outerColumn.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={
              <span>
                {col.header}
                {col.required && <span className="p-error">*</span>}
              </span>
            }
            sortable={col.sortable}
            expander={col.expander}
            className={col.className}
            alignHeader={col.alignHeader}
            headerStyle={col.headerStyle}
            headerClassName={col.headerClassName}
            style={{
              minWidth: col.minWidth && col.minWidth,
              maxWidth: col.maxWidth && col.maxWidth,
              display: col.display,
              textAlign: col.textAlign && col.textAlign,
              paddingLeft: col.paddingLeft,
              wordWrap: "break-word",
              ...columnStyle,
            }}
            body={col.field === props.customActionsField ? col.body : col.body}
          />
        ))}
        <Column
          expander={defaultIndex ? allowQuesExpansion : allowExpansion}
          headerStyle={iconHeaderStyle}
          style={{ width: "5rem", textAlign: "left", ...iconStyle }}
        />
      </TableData>
    </div>
  );
};