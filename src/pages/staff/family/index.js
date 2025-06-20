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
  hideOverFlow,
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
  const [familyCode, setFamilyCode] = useState(null);
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

  const handleFamilyCode = (e) => {
    const re = /^[0-9-]+$/;
    if (e.target.value.length <= 0) {
      setFamilyCode("");
      return;
    }
    if (re.test(convertToSingleByte(e.target.value))) {
      if (e.target.value.length == 4) {
        const newValue = e.target.value;
        if (newValue.indexOf("-") !== -1) {
          setFamilyCode(e.target.value);
        } else {
          setFamilyCode(newValue);
        }
      } else if (e.target.value.length == 3) {
        const newValue = e.target.value;
        const formattedValue = newValue.substring(0, 3);
        setFamilyCode(formattedValue);
      } else {
        setFamilyCode(e.target.value);
      }
    } else {
      setFamilyCode("");
    }
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
      maxWidth: "3rem",
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
      field: "family_code",
      header: translate(localeJson, "family_code"),
      headerClassName: "custom-header",
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "3rem",
      maxWidth: "4rem",
    },
    {
      field: "family_count",
      header: translate(localeJson, "family_count"),
      headerClassName: "custom-header",
      sortable: false,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "3rem",
      maxWidth: "3rem",
    },
    {
      field: "person_dob",
      header: translate(localeJson, "dob"),
      headerClassName: "custom-header",
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "2rem",
      maxWidth: "5rem",
    },
    {
      field: "person_age",
      header: translate(localeJson, "age"),
      headerClassName: "custom-header",
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "2rem",
      maxWidth: "3rem",
    },
    {
      field: "person_gender",
      header: translate(localeJson, "gender"),
      headerClassName: "custom-header",
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "3rem",
      maxWidth: "3rem",
    },
    {
      field: "special_care_name",
      header: translate(localeJson, "c_special_care"),
      sortable: false,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "3rem",
      maxWidth: "3rem",
    },
    {
      field: "person_is_owner",
      header: translate(localeJson, "representative"),
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "3.5rem",
      maxWidth: "3.5rem",
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
        family_code: familyCode,
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
        family_code: listPayload.filters.family_code,
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
          let person_is_owner =
            element.person_is_owner == 0
              ? translate(localeJson, "representative")
              : "";

          let tempObj = {
            ...element,
            si_no: siNo,
            place_name: placeIdObj[element.place_id] ?? "",
            id: element.f_id,
            family_count: element.persons_count,
            person_dob: date_of_birth,
            person_gender: gender_val,
            person_is_owner: person_is_owner,
            family_join_date: admisssion_dt,
            evacuation_days: evacuation_days,
            special_care_name: getSpecialCareName(
              element.person_special_cares,
              locale
            ),
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
          <div className="card">
            <div
              className="gap-2 flex justify-content-between"
            >
              <div className="flex gap-2 align-items-center">
                <CustomHeader
                  headerClass={"page-header1"}
                  header={translate(localeJson, "list_of_evacuees")}
                />
                <span className="page-header1-sub mb-2">{` (${totalCount}${translate(
                  localeJson,
                  "people"
                )})`}</span>
              </div>
              <div className='mb-2 flex align-items-center'>
                <Button buttonProps={{
                  type: 'submit',
                  rounded: "true",
                  export: true,
                  buttonClass: "evacuation_button_height export-button",
                  text: translate(localeJson, 'export'),
                  onClick: () => downloadEvacueesListCSV()
                }} parentClass={"mr-1 export-button"} />
              </div>
            </div>
            <div>
              <div>
                <form>
                  <div className="modal-field-top-space modal-field-bottom-space flex flex-wrap float-right justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input">
                    <Input
                      inputProps={{
                        inputParentClassName:
                          "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                        labelProps: {
                          text: translate(localeJson, "family_code"),
                          inputLabelClassName: "block",
                        },
                        inputClassName:
                          "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                        id: "familyCode",
                        name: "familyCode",
                        value: familyCode,
                        onChange: (e) => handleFamilyCode(e),
                      }}
                    />
                    <Input
                      inputProps={{
                        id:"refugeeName",
                        name:"refugeeName",
                        inputParentClassName:
                          "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                        labelProps: {
                          text: translate(localeJson, "name"),
                          inputLabelClassName: "block",
                        },
                        inputClassName:
                          "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                        value: refugeeName,
                        onChange: (e) => setRefugeeName(e.target.value),
                      }}
                    />
                    <div className="flex align-items-end">
                      <Button
                        buttonProps={{
                          buttonClass: "w-12 search-button",
                          text: translate(localeJson, "search_text"),
                          icon: "pi pi-search",
                          type: "button",
                          onClick: () => searchListWithCriteria(),
                        }}
                        parentClass={"search-button"}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="mt-3">
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
