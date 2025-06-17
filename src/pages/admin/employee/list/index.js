import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
// import _ from 'lodash';

import {
  convertToSingleByte,
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getYYYYMMDDHHSSSSDateTimeFormat,
  getValueByKeyRecursively as translate,
} from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CustomHeader, Input, NormalTable } from '@/components';
import { EmployeeServices } from '@/services'; // <-- Make sure this service exists

export default function EmployeeListPage() {
  const { locale, localeJson } = useContext(LayoutContext);
  const [employeeList, setEmployeeList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [getListPayload, setGetListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: '',
      order_by: 'desc',
      employee_name: '',
    },
  });

  const columns = [
    { field: 'si_no', header: '#', sortable: false },
    { field: 'employee_code', header: translate(localeJson, 'employee_code'), sortable: true },
    { field: 'employee_name', header: translate(localeJson, 'employee_name'), sortable: true },
    {
      field: 'dob',
      header: translate(localeJson, 'dob'),
      body: (row) =>
        locale === 'ja'
          ? getJapaneseDateDisplayYYYYMMDDFormat(row.dob)
          : getEnglishDateDisplayFormat(row.dob),
      sortable: true,
    },
    { field: 'department', header: translate(localeJson, 'department'), sortable: true },
  ];

  const { getEmployeeList, exportEmployeeCSV } = EmployeeServices;

  const fetchEmployees = async () => {
    setTableLoading(true);
    const payload = {
      filters: {
        ...getListPayload.filters,
        employee_name: searchName,
      },
    };
    getEmployeeList(payload, handleResponse);
  };

  const handleResponse = (res) => {
    if (res?.success) {
      const rows = res.data.list.map((emp, i) => ({
        si_no: i + getListPayload.filters.start + 1,
        employee_code: emp.code,
        employee_name: emp.name,
        dob: emp.dob,
        department: emp.department,
      }));
      setEmployeeList(rows);
      setTotalCount(res.data.total);
    }
    setTableLoading(false);
  };

  const handleExport = () => {
    exportEmployeeCSV(getListPayload, (res) => {
      if (res.success) {
        const downloadLink = document.createElement('a');
        downloadLink.href = res.result.filePath;
        downloadLink.download = 'Employee_' + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + '.csv';
        downloadLink.click();
      }
    });
  };

  const handlePagination = (e) => {
    setGetListPayload((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        start: e.first,
        limit: e.rows,
      },
    }));
  };

  useEffect(() => {
    fetchEmployees();
  }, [getListPayload, locale]);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
         <div className="flex flex-wrap align-items-center justify-content-between">
             <div className='flex align-items-center gap-2 mb-2'>
            <CustomHeader
              headerClass="page-header1"
              customParentClassName="mb-0"
              header={translate(localeJson, 'employee_list')}
            />
            </div>
            <div>
            <Button
              buttonProps={{
                text: translate(localeJson, 'export'),
                export: true,
                onClick: handleExport,
                buttonClass: 'export-button',
              }}
              parentClass="export-button"
            />
            </div>
          </div>

          <form>
            <div className='modal-field-top-space modal-field-bottom-space flex flex-wrap float-right justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input'>
              <Input
                inputProps={{
                  name: 'employee_name',
                  inputClassName: 'w-full md:w-14rem',
                  labelProps: {
                    text: translate(localeJson, 'name'),
                    inputLabelClassName: 'block',
                  },
                  value: searchName,
                  onChange: (e) => setSearchName(e.target.value),
                }}
              />
               <div className="flex align-items-end">
                                                          <Button buttonProps={{
                                                              buttonClass: "w-12 search-button",
                                                              text: translate(localeJson, "search_text"),
                                                              icon: "pi pi-search",
                                                              type: "button",
                                                              onClick: () => fetchEmployees()
                                                          }} parentClass={"search-button"} />
                                                      </div>
            </div>
          </form>

          <NormalTable
            lazy
            id="employee-list"
            totalRecords={totalCount}
            loading={tableLoading}
            size="small"
            stripedRows={true}
            paginator
            showGridlines
            value={employeeList}
            columns={columns}
            first={getListPayload.filters.start}
            rows={getListPayload.filters.limit}
            emptyMessage={translate(localeJson, 'data_not_found')}
            onPageHandler={handlePagination}
            paginatorLeft={true}
            onSort={(e) =>
              setGetListPayload({
                ...getListPayload,
                filters: {
                  ...getListPayload.filters,
                  sort_by: e.sortField,
                  order_by: getListPayload.filters.order_by === 'desc' ? 'asc' : 'desc',
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
