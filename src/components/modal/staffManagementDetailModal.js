import React, { useEffect, useContext, useState } from "react";
import { Dialog } from "primereact/dialog";
import _ from "lodash";
import { TabView, TabPanel } from "primereact/tabview";

import { Button, NormalTable } from "@/components";
import {
  getEnglishDateTimeDisplayActualFormat,
  getJapaneseDateTimeDayDisplayActualFormat,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { StaffManagementService } from "@/services";
import { useAppSelector } from "@/redux/hooks";

const StaffManagementDetailModal = React.memo(function StaffManagementDetailModal(props) {
  const { localeJson, locale } = useContext(LayoutContext);
  // Getting storage data with help of reducers
  const layoutReducer = useAppSelector((state) => state.layoutReducer);
  const { open, close } = props && props;

  const [staffDetail, setStaffDetail] = useState([]);
  const staffDetailData = [
    { field: "name", header: translate(localeJson, "name") },
    {
      field: "tel",
      header: translate(localeJson, "tel"),
      textAlign: "center",
      alignHeader: "center",
    },
  ];
  const columnsData = [
    {
      field: "slno",
      header: translate(
        localeJson,
        "staff_management_detail_login_history_slno"
      ),
      headerClassName: "sno_class",
      textAlign: "center",
      alignHeader: "center",
    },
    {
      field: "name",
      header: translate(
        localeJson,
        "staff_management_detail_login_history_name"
      ),
      maxWidth: "2rem",
    },
    {
      field: "login_datetime",
      header: translate(
        localeJson,
        "staff_management_detail_login_history_login_datetime"
      ),
      maxWidth: "2rem",
    },
    {
      field: "logout_datetime",
      header: translate(localeJson, "logout_dateTime"),
      maxWidth: "2rem",
    },
  ];
  const columnsPlaceData = [
    {
      field: "slno",
      header: translate(
        localeJson,
        "staff_management_detail_login_history_slno"
      ),
      headerClassName: "sno_class",
      textAlign: "center",
      alignHeader: "center",
    },
    {
      field: "name",
      header: translate(
        localeJson,
        "staff_management_place_detail_login_history_name"
      ),
      minWidth: "4rem",
      maxWidth: "4rem",
    },
    {
      field: "login_datetime",
      header: translate(
        localeJson,
        "staff_management_detail_login_history_login_datetime"
      ),
    },
    {
      field: "logout_datetime",
      header: translate(localeJson, "logout_dateTime"),
    },
  ];
  const [getListPayload, setGetListPayload] = useState({
    filters: {
      start: 0,
    },
    id: props.staff,
  });
  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [placeColumns, setPlaceColumns] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  const [placeTotalCount, setPlaceTotalCount] = useState(0);
  const [placeTableLoading, setPlaceTableLoading] = useState(false);
  // Main Table listing starts
  const { show } = StaffManagementService;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await getStaffList();
    };
    fetchData();
  }, [locale, getListPayload, props.staff]);

  const getStaffList = () => {
    // Get dashboard list
    show(getListPayload, (response) => {
      if (response?.success && !_.isEmpty(response.data)) {
        var additionalColumnsArrayWithOldData = [...columnsData];
        var additionalColumnsArrayWithPlaceOldData = [...columnsPlaceData];
        if (response.data.event_login_history.total > 0) {
          const data = response.data.event_login_history.list;
          let preparedList = [];
          // Preparing row data for specific column to display
          data.map((obj, i) => {
            let preparedObj = {
              slno: i + getListPayload.filters.start + 1,
              name: obj.name ?? "",
              login_datetime: obj.login_datetime
                ? locale == "ja"
                  ? getJapaneseDateTimeDayDisplayActualFormat(obj.login_datetime)
                  : getEnglishDateTimeDisplayActualFormat(obj.login_datetime)
                : "",
              logout_datetime: obj.logout_datetime
                ? locale == "ja"
                  ? getJapaneseDateTimeDayDisplayActualFormat(obj.logout_datetime)
                  : getEnglishDateTimeDisplayActualFormat(obj.logout_datetime)
                : "",
            };
            preparedList.push(preparedObj);
          });
          setTableLoading(false);
          setColumns(additionalColumnsArrayWithOldData);
          setList(preparedList);
          setTotalCount(response.data.event_login_history.total);
        } else {
          setTableLoading(false);
          setColumns(additionalColumnsArrayWithOldData);
          setList([]);
          setTotalCount(0);
        }
        if (response.data.place_login_history.total > 0) {
          const data = response.data.place_login_history.list;
          let preparedList = [];
          // Preparing row data for specific column to display
          data.map((obj, i) => {
            let preparedObj = {
              slno: i + getListPayload.filters.start + 1,
              name: obj.name ?? "",
              login_datetime: obj.login_datetime
                ? locale == "ja"
                  ? getJapaneseDateTimeDayDisplayActualFormat(obj.login_datetime)
                  : getEnglishDateTimeDisplayActualFormat(obj.login_datetime)
                : "",
              logout_datetime: obj.logout_datetime
                ? locale == "ja"
                  ? getJapaneseDateTimeDayDisplayActualFormat(obj.logout_datetime)
                  : getEnglishDateTimeDisplayActualFormat(obj.logout_datetime)
                : "",
            };
            preparedList.push(preparedObj);
          });
          setPlaceColumns(additionalColumnsArrayWithPlaceOldData);
          setPlaceList(preparedList);
          setPlaceTotalCount(response.data.place_login_history.total);
          setPlaceTableLoading(false);
        } else {
          setPlaceTableLoading(false);
          setPlaceColumns(additionalColumnsArrayWithPlaceOldData);
          setPlaceList([]);
          setPlaceTotalCount(0);
        }
        if (response.data.model) {
          setStaffDetail([
            { name: response.data.model.name, tel: response.data.model.tel },
          ]);
        }
      } else {
        setTableLoading(false);
        setList([]);
        setTotalCount(0);
        setPlaceList([]);
        setPlaceTotalCount(0);
      }
    });
  };

  /**
   * Pagination handler
   * @param {*} e
   */
  const onPaginationChange = async (e) => {
    setTableLoading(true);
    if (!_.isEmpty(e)) {
      const newStartValue = e.first; // Replace with your desired page value
      const newLimitValue = e.rows; // Replace with your desired limit value
      await setGetListPayload((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue,
        },
      }));
    }
  };

  return (
    <React.Fragment>
      <div>
        <Dialog
          className="new-custom-modal lg:w-6 md:w-9 sm:w-10"
          header={translate(localeJson, "history_login_staff_management")}
          visible={open}
          draggable={false}
          blockScroll={true}
          onHide={() => close()}
          footer={
            <div className="text-center">
              <Button
                buttonProps={{
                  buttonClass: "w-8rem back-button",
                  text: translate(localeJson, "back"),
                  onClick: () => close(),
                }}
                parentClass={"inline back-button"}
              />
            </div>
          }
        >
          <div className={`modal-content staff_modal`}>
            <div>
              <div className="modal-header">
                {translate(localeJson, "detail_staff_management")}
              </div>
              <div className="modal-field-bottom-space">
                <NormalTable
                  loading={tableLoading}
                  tableStyle={{ maxWidth: "w-full" }}
                  showGridlines={"true"}
                  columnStyle={{ textAlign: "center" }}
                  customActionsField="actions"
                  value={staffDetail}
                  columns={staffDetailData}
                  emptyMessage={translate(localeJson, "data_not_found")}
                />
              </div>
              <div>
                <div>
                  <TabView
                    activeIndex={layoutReducer?.layout?.config?.ADMIN_STAFF_MANAGAMENT_EVENT_MAP ? 0 : 1}
                  >
                    {layoutReducer?.layout?.config?.ADMIN_STAFF_MANAGAMENT_EVENT_MAP && (
                      <TabPanel
                        header={translate(localeJson, "event_information")}
                      >
                        <NormalTable
                          lazy
                          totalRecords={totalCount}
                          loading={tableLoading}
                          tableStyle={{ maxWidth: "w-full" }}
                          stripedRows={true}
                          className={"custom-table-cell"}
                          showGridlines={"true"}
                          value={list}
                          columns={columnsData}
                          filterDisplay="menu"
                          emptyMessage={translate(localeJson, "data_not_found")}
                          first={getListPayload.filters.start}
                          rows={getListPayload.filters.limit}
                          scrollable
                          scrollHeight="400px"
                          onPageHandler={(e) => onPaginationChange(e)}
                        />
                      </TabPanel>
                    )}
                    <TabPanel
                      header={translate(localeJson, "place_information")}
                    >
                      <NormalTable
                        lazy
                        totalRecords={placeTotalCount}
                        loading={placeTableLoading}
                        stripedRows={true}
                        tableStyle={{ maxWidth: "w-full" }}
                        className={"custom-table-cell"}
                        showGridlines={"true"}
                        value={placeList}
                        columns={columnsPlaceData}
                        filterDisplay="menu"
                        emptyMessage={translate(localeJson, "data_not_found")}
                        first={getListPayload.filters.start}
                        rows={getListPayload.filters.limit}
                        scrollable
                        scrollHeight="400px"
                        onPageHandler={(e) => onPaginationChange(e)}
                      />
                    </TabPanel>
                  </TabView>
                </div>
              </div>
              <div className="text-center">
                <div className="modal-button-footer-space-back">
                  <Button
                    buttonProps={{
                      buttonClass: "w-full back-button",
                      text: translate(localeJson, "back"),
                      onClick: () => close(),
                    }}
                    parentClass={"inline back-button"}
                  />
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </React.Fragment>
  );
});
StaffManagementDetailModal.displayName = 'StaffManagementDetailModal';
export default StaffManagementDetailModal;