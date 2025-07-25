/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import _ from "lodash";

import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getYYYYMMDDHHSSSSDateTimeFormat,
  getValueByKeyRecursively as translate,
  getNumberOfEvacuationDays,
  showOverFlow,
  getSpecialCareName,
  convertToSingleByte,
  mobileCheck,
} from "@/helper";
import {
  Button,
  CustomHeader,
  NormalTable,
  Input,
} from "@/components";
import { useAppDispatch } from "@/redux/hooks";
import { setFamily } from "@/redux/family";
import { StaffEvacuationServices } from "@/services";

function StaffFamily() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Getting storage data with help of reducers
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const [placeID, setPlaceID] = useState(
    !_.isNull(localStorage.getItem("place_id"))
      ? localStorage.getItem("place_id")
      : ""
  );

  const [familyCount, setFamilyCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [refugeeName, setRefugeeName] = useState(null);
  const [columnValues, setColumnValues] = useState([]);
  const [staffFamilyDialogVisible, setStaffFamilyDialogVisible] =
    useState(false);
  const [listPayload, setListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: "",
      order_by: "desc",
      family_code: "",
      refugee_name: "",
    },
    place_id: placeID,
  });



  /**
   * Pagination handler
   * @param {*} e
   */
  const onPaginationChange = async (e) => {
    setTableLoading(true);
    if (!_.isEmpty(e)) {
      const newStartValue = e.first; // Replace with your desired page value
      const newLimitValue = e.rows; // Replace with your desired limit value
      await setListPayload((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue,
        },
      }));
    }
  };

  const columnNames = [
    {
      field: "si_no",
      header: translate(localeJson, "si_no"),
      sortable: false,
      textAlign: "center",
      minWidth: "1rem",
      maxWidth: "2rem",
      alignHeader: "left",
    },
    {
      field: "person_refugee_name",
      header: translate(localeJson, "name_public_evacuee"),
      sortable: true,
      alignHeader: "left",
      minWidth: "10rem",
      maxWidth: "16rem",
      body: (rowData) => {
        return (
          <div className="flex flex-column">
            <div className="custom-header font-bold">{rowData.person_name}</div>
            <div className="table-body-sub">{rowData.person_refugee_name}</div>
          </div>
        );
      },
    },
    {
      field: "person_dob",
      header: translate(localeJson, "dob"),
      headerClassName: "custom-header",
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "10rem",
      maxWidth: "10rem",
    },
    {
      field: "person_gender",
      header: translate(localeJson, "gender"),
      headerClassName: "custom-header",
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "8rem",
      maxWidth: "8rem",
    },
     {
          field: "person_dept_id",
          header: translate(localeJson, "department"),
          sortable: false,
          minWidth: "10rem",
          maxWidth: "14rem",
          body: (row) => {
            return row.person_dept;
          },
        },
        {
              field: "place_name",
              header: translate(localeJson, "evacuation_place"),
              sortable: false,
              minWidth: "8rem",
              maxWidth: "12rem",
            },

  ];

  /**
   * CommonDialog modal close
   */
  const onClickCancelButton = () => {
    setStaffFamilyDialogVisible(false);
    showOverFlow();
  };

  /**
   * CommonDialog modal open
   */
  const onClickOkButton = () => {
    let isMobile = mobileCheck();
    localStorage.setItem("isCamera",isMobile?"true":"false");
    localStorage.setItem("isScanner", "false");
    // Once both dispatch actions have completed, navigate to the next page
    router.push("/user/family/register");
  };

  const searchListWithCriteria = () => {
    let payload = {
      filters: {
        start: 0,
        limit: listPayload.filters.limit,
        sort_by: "",
        order_by: "desc",
        refugee_name: refugeeName,
      },
      place_id: listPayload.place_id,
    };
    setListPayload(payload);
  };

  const getGenderValue = (gender) => {
    if (gender == 1) {
      return translate(localeJson, "male");
    } else if (gender == 2) {
      return translate(localeJson, "female");
    } else if (gender == 3) {
      return translate(localeJson, "others_count");
    }
  };

  /**
   * Get Evacuees list on mounting
   */
  const listApiCall = async () => {
    let payload = {
      filters: {
        start: listPayload.filters.start,
        limit: listPayload.filters.limit,
        sort_by: listPayload.filters.sort_by,
        order_by: listPayload.filters.order_by,
        refugee_name: listPayload.filters.refugee_name,
      },
      place_id: listPayload.place_id,
    };
    let placeIdObj = {};
    await StaffEvacuationServices.getStaffEvecueesList(payload, (response) => {
      var tempList = [];
      var listTotalCount = 0;
      if (
        response &&
        response?.success &&
        !_.isEmpty(response?.data) &&
        response?.data?.total > 0
      ) {
        let actualList = response.data.list;
        let familyCountObj = {};
        let previousItem = null;
        let siNo = listPayload.filters.start + 1;

        response.places.forEach((place, index) => {
          placeIdObj[place.id] =
            locale == "ja" ? place.name : place.name_en ?? place.name;
        });

        actualList.forEach((element, index) => {
          let date_of_birth =
            locale == "ja"
              ? getJapaneseDateDisplayYYYYMMDDFormat(element.person_dob)
              : getEnglishDateDisplayFormat(element.person_dob);
          let admisssion_dt =
            locale == "ja"
              ? getJapaneseDateDisplayYYYYMMDDFormat(element.family_join_date)
              : getEnglishDateDisplayFormat(element.family_join_date);
          let gender_val = getGenderValue(element.person_gender);
          let evacuation_days = element.family_join_date
            ? getNumberOfEvacuationDays(element.family_join_date)
            : "";


          let tempObj = {
            ...element,
            si_no: siNo,
            id: element.f_id,
            family_count: element.persons_count,
            person_dob: date_of_birth,
            person_gender: gender_val,
            family_join_date: admisssion_dt,
            evacuation_days: evacuation_days,
            place_name:locale == "ja" ? element.place_name : element.place_name_en ?? element.place_name,
            person_dept:element.person_dept_id

          };
          previousItem = tempObj;
          tempList.push(tempObj);
          siNo = siNo + 1;
        });
        listTotalCount = response.data.total;
        setFamilyCount(response?.data?.total_family ?? 0);
      }
      setLoader(false);
      setTableLoading(false);
      setColumnValues(tempList);
      setTotalCount(listTotalCount);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await listApiCall();
      setLoader(false);
    };
    fetchData();
  }, [locale, listPayload]);

  const downloadEvacueesListCSV = () => {
    StaffEvacuationServices.exportStaffFamilyEvacueesCSVList(listPayload, exportStaffFamilyEvacueesCSV);
  }

  const exportStaffFamilyEvacueesCSV = (response) => {
    if (response.success) {
      const downloadLink = document.createElement("a");
      const fileName =
        "StaffFamily_" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
      downloadLink.href = response.result.filePath;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  };

  return (
    <>
      <div className="grid">
        <div className="col-12">
          <div className="card" role="region" aria-label={translate(localeJson, "list_of_evacuees")}>
            <div className="gap-2 flex justify-content-between">
              <div className="flex gap-2 align-items-center">
                <CustomHeader
                  headerClass={"page-header1"}
                  header={translate(localeJson, "list_of_evacuees")}
                  aria-label={translate(localeJson, "list_of_evacuees")}
                />
                <span
                  className="page-header1-sub mb-2"
                  aria-live="polite"
                >{` (${totalCount}${translate(localeJson, "people")})`}</span>
              </div>
              <div className='mb-2 flex align-items-center'>
                <Button buttonProps={{
                  type: 'button',
                  rounded: "true",
                  export: true,
                  buttonClass: "evacuation_button_height export-button",
                  text: translate(localeJson, 'export'),
                  onClick: () => downloadEvacueesListCSV(),
                  'aria-label': translate(localeJson, 'export'),
                }} parentClass={"mr-1 export-button"} />
              </div>
            </div>
            <div>
              <div>
                <form aria-label={translate(localeJson, "search_form")} role="search">
                  <div className="modal-field-top-space modal-field-bottom-space flex flex-wrap float-right justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input">
                    <Input
                      inputProps={{
                        id: "refugeeName",
                        name: "refugeeName",
                        inputParentClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                        labelProps: {
                          text: translate(localeJson, "name"),
                          inputLabelClassName: "block",
                          htmlFor: "refugeeName",
                        },
                        inputClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                        value: refugeeName,
                        onChange: (e) => setRefugeeName(e.target.value),
                        ariaLabel: translate(localeJson, "refugeeName"),
                      }}
                    />
                    <div className="flex align-items-end">
                      <Button
                        buttonProps={{
                          buttonClass: "w-12 search-button",
                          text: translate(localeJson, "search_text"),
                          icon: "pi pi-search",
                          type: "submit",
                          'aria-label': translate(localeJson, "search_text"),
                          onClick: (e) => {
                            e.preventDefault();
                            searchListWithCriteria();
                          }
                        }}
                        parentClass={"search-button"}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="mt-3" role="region" aria-label={translate(localeJson, "list_of_evacuees_table")}>
                <NormalTable
                  lazy
                  totalRecords={totalCount}
                  loading={tableLoading}
                  size={"small"}
                  stripedRows={true}
                  paginator={"true"}
                  showGridlines={"true"}
                  value={columnValues}
                  columns={columnNames}
                  emptyMessage={translate(localeJson, "data_not_found")}
                  first={listPayload.filters.start}
                  rows={listPayload.filters.limit}
                  paginatorLeft={true}
                  onPageHandler={(e) => onPaginationChange(e)}
                  onSort={(data) => {
                    setListPayload({
                      ...listPayload,
                      filters: {
                        ...listPayload.filters,
                        sort_by: data.sortField,
                        order_by:
                          listPayload.filters.order_by === "desc"
                            ? "asc"
                            : "desc",
                      },
                    });
                  }}
                  selectionMode="single"
                  onSelectionChange={(e) => {
                    dispatch(setFamily({ family_id: e.value.family_id }));
                    router.push({
                      pathname: "/staff/family/family-detail",
                    });
                  }}
                  tableProps={{
                    role: "table",
                    'aria-label': translate(localeJson, "list_of_evacuees"),

                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StaffFamily;
