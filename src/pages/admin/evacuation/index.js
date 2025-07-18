/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import { useRouter } from "next/router";

import {
  convertToSingleByte,
  getEnglishDateDisplayFormat,
  getGeneralDateTimeSlashDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getYYYYMMDDHHSSSSDateTimeFormat,
  getValueByKeyRecursively as translate,
  hideOverFlow,
  showOverFlow,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  CustomHeader,
  Input,
  InputDropdown,
  NormalTable,
  InputSwitch,
} from "@/components";
import { setFamily } from "@/redux/family";
import { useAppDispatch } from "@/redux/hooks";
import { getSpecialCareName } from "@/helper";
import { EvacuationServices } from "@/services";
import { AdminManagementDeleteModal } from "@/components/modal";

export default function EvacuationPage() {
  const { locale, localeJson } = useContext(LayoutContext);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [familyCount, setFamilyCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState({
    name: "--",
    id: 0,
  });
  const [selectedStatusOption, setSelectedStatusOption] = useState("");
  const [evacueesDataList, setEvacueesDataList] = useState([]);
  const [evacuationPlaceList, setEvacuationPlaceList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [familyCode, setFamilyCode] = useState(null);
  const [refugeeName, setRefugeeName] = useState(null);
  const [evacuationTableFields, setEvacuationTableFields] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showRegisteredEvacuees, setShowRegisteredEvacuees] = useState(false);
  const [getListPayload, setGetListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: "",
      order_by: "desc",
      place_id: "",
      family_code: "",
      refugee_name: "",
      checkout_flg: "",
    },
  });

  const evacuationTableColumns = [
    {
      field: "si_no",
      header: translate(localeJson, "si_no"),
      sortable: false,
      headerClassName: "sno_class",
      textAlign: "center",
      alignHeader: "left",
      minWidth: "4rem",
      maxWidth: "6rem",
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
            <div className="custom-header">{rowData.person_name}</div>
            <div className="table-body-sub">{rowData.person_refugee_name}</div>
          </div>
        );
      },
    },
    {
      field: "family_is_registered",
      header: translate(localeJson, "status_furigana"),
      sortable: true,
      alignHeader: "left",
      minWidth: "8rem",
      maxWidth: "12rem",
    },
    {
      field: "place_name",
      header: translate(localeJson, "place_name"),
      sortable: false,
      textAlign: "center",
      alignHeader: "center",
      minWidth: "10rem",
      maxWidth: "14rem",
    },
    {
      field: "family_code",
      header: translate(localeJson, "family_code"),
      sortable: true,
      textAlign: "center",
      alignHeader: "center",
      minWidth: "8rem",
      maxWidth: "12rem",
    },
    {
      field: "family_count",
      header: translate(localeJson, "family_count"),
      sortable: false,
      textAlign: "center",
      alignHeader: "center",
      minWidth: "4rem",
      maxWidth: "6rem",
    },
    {
      field: "person_dob",
      header: translate(localeJson, "dob"),
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "10rem",
      maxWidth: "14rem",
    },
    {
      field: "person_age",
      header: translate(localeJson, "age"),
      sortable: true,
      textAlign: "center",
      alignHeader: "center",
      minWidth: "6rem",
      maxWidth: "8rem",
    },
    {
      field: "person_gender",
      header: translate(localeJson, "gender"),
      sortable: true,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "8rem",
      maxWidth: "12rem",
    },
    {
      field: "special_care_name",
      header: translate(localeJson, "c_special_care"),
      sortable: false,
      textAlign: "left",
      alignHeader: "left",
      minWidth: "10rem",
      maxWidth: "14rem",
    },
  ];

  /**
   * Get Evacuees list on mounting
   */
  const onGetEvacueesListOnMounting = () => {
    let payload = {
      filters: {
        start: getListPayload.filters.start,
        limit: getListPayload.filters.limit,
        sort_by: getListPayload.filters.sort_by,
        order_by: getListPayload.filters.order_by,
        place_id: getListPayload.filters.place_id,
        family_code: getListPayload.filters.family_code,
        refugee_name: getListPayload.filters.refugee_name,
        checkout_flg: getListPayload.filters.checkout_flg,
      },
    };
    getList(payload, onGetEvacueesList);
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

  const getPlaceName = (id) => {
    let data = evacuationPlaceList.find((obj) => obj.id == id);
    if (data) {
      return data.name;
    }
    return "";
  };

  const getOptions = (locale) => {
    if (locale === "ja") {
      return [
        { label: "すべて", value: "" }, // All
        { label: "入所", value: 0 }, // Check-in
        { label: "退所", value: 1 }, // Check-out
      ];
    } else {
      return [
        { label: "All", value: "" },
        { label: "Check-in", value: 0 },
        { label: "Check-out", value: 1 },
      ];
    }
  };

  const onGetEvacueesList = (response) => {
    var evacuationColumns = [...evacuationTableColumns];
    var evacueesList = [];
    var placesList = [
      {
        name: "--",
        id: 0,
      },
    ];
    var totalFamilyCount = 0;
    var listTotalCount = 0;
    if (
      response?.success &&
      !_.isEmpty(response.data) &&
      response.data.list.length > 0
    ) {
      const data = response.data.list;
      const questionnaire = response.data?.person_questionnaire;
      const places = response.places;
      let previousItem = null;
      let siNo = getListPayload.filters.start + 1;
      if (questionnaire && questionnaire?.length > 0) {
        questionnaire.map((ques, num) => {
          evacuationColumns.push({
            field: "question_" + ques.id,
            header: locale == "ja" ? ques.title : ques.title_en,
            minWidth: "10rem",
            maxWidth: "16rem",
            display: "none",
          });
        });
      }
      evacuationColumns.push({
        field: "person_is_owner",
        header: translate(localeJson, "representative"),
        sortable: true,
        textAlign: "left",
        alignHeader: "left",
        minWidth: "8rem",
        maxWidth: "12rem",
      });
      let placeIdObj = {};
      places.map((place) => {
        let placeData = {
          name:
            locale == "ja"
              ? place.name
              : place.name_en
              ? place.name_en
              : place.name,
          id: place.id,
        };
        (placeIdObj[place.id] =
          locale == "ja"
            ? place.name
            : place.name_en
            ? place.name_en
            : place.name),
          placesList.push(placeData);
      });
      setEvacuationPlaceList(placesList);
      data.map((item, i) => {
        let evacuees = {
          si_no: i + parseInt(getListPayload.filters.start) + 1,
          id: item.f_id,
          place_name: placeIdObj[item.place_id] ?? "",
          family_count: item.persons_count,
          family_code: item.family_code,
          person_is_owner:
            item.person_is_owner == 0
              ? translate(localeJson, "representative")
              : "",
          person_refugee_name: (
            <div className={"clickable-row"}>{item.person_refugee_name}</div>
          ),
          person_name: (
            <div className={"text-highlighter-user-list clickable-row"}>
              {item.person_name}
            </div>
          ),
          person_gender: getGenderValue(item.person_gender),
          person_dob:
            locale == "ja"
              ? getJapaneseDateDisplayYYYYMMDDFormat(item.person_dob)
              : getEnglishDateDisplayFormat(item.person_dob),
          person_age: item.person_age,
          age_month: item.person_month,
          special_care_name: item.person_special_cares
            ? getSpecialCareName(item.person_special_cares, locale)
            : "-",
          remarks: item.person_note,
          place: item.place_id ? getPlaceName(item.place_id) : "",
          connecting_code: item.person_connecting_code,
          out_date: item.family_out_date
            ? getGeneralDateTimeSlashDisplayFormat(item.family_out_date)
            : "",
          family_is_registered:
            item.family_is_registered == 1
              ? translate(localeJson, "check_in")
              : translate(localeJson, "exit"),
        };
        let personAnswers = item.person_answers ? item.person_answers : [];
        if (personAnswers.length > 0) {
          personAnswers.map((ques) => {
            evacuees[`question_${ques.question_id}`] =
              locale == "ja"
                ? ques.answer.length > 0
                  ? getAnswerData(ques.answer)
                  : ""
                : ques.answer_en.length > 0
                ? getAnswerData(ques.answer_en)
                : "";
          });
        }
        previousItem = evacuees;
        evacueesList.push(evacuees);
        siNo = siNo + 1;
      });
      totalFamilyCount = response.data.total_family;
      listTotalCount = response.data.total;
    } else {
      evacuationColumns.push({
        field: "person_is_owner",
        header: translate(localeJson, "representative"),
        sortable: true,
        textAlign: "left",
        alignHeader: "left",
        minWidth: "8rem",
        maxWidth: "12rem",
      });
    }
    setTableLoading(false);
    setEvacuationTableFields(evacuationColumns);
    setEvacueesDataList(evacueesList);
    setFamilyCount(totalFamilyCount);
    setTotalCount(listTotalCount);
  };

  const getAnswerData = (answer) => {
    let answerData = null;
    answer.map((item) => {
      answerData = answerData ? answerData + ", " + item : item;
    });
    return answerData;
  };

  /* Services */
  const { getList, exportEvacueesCSVList, bulkDelete } = EvacuationServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await onGetEvacueesListOnMounting();
    };
    fetchData();
  }, [locale, getListPayload]);

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

  const searchListWithCriteria = () => {
    let payload = {
      filters: {
        start: 0,
        limit: getListPayload.filters.limit,
        sort_by: "",
        order_by: "desc",
        place_id:
          selectedOption && selectedOption.id != 0 ? selectedOption.id : "",
        family_code: convertToSingleByte(familyCode),
        refugee_name: refugeeName,
        checkout_flg: selectedStatusOption,
      },
    };
    getList(payload, onGetEvacueesList);
    setGetListPayload(payload);
  };

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

  const downloadEvacueesListCSV = () => {
    exportEvacueesCSVList(getListPayload, exportEvacueesCSV);
  };

  const exportEvacueesCSV = (response) => {
    if (response.success) {
      const downloadLink = document.createElement("a");
      const fileName =
        "Evacuation_" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
      downloadLink.href = response.result.filePath;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  };

  /**
   * Delete modal open handler
   * @param {*} rowdata
   */
  const openDeleteDialog = () => {
    setDeleteOpen(true);
    hideOverFlow();
  };

  /**
   * On confirmation delete api call and close modal functionality handler
   * @param {*} status
   */
  const onDeleteClose = (status = "") => {
    if (status == "confirm") {
      onConfirmDeleteRegisteredEvacuees();
    }
    setDeleteOpen(false);
    showOverFlow();
  };

  /**
   * Delete registered evacuees
   */
  const onConfirmDeleteRegisteredEvacuees = async () => {
    setTableLoading(true);
    await bulkDelete(getListPayload, () => {
      setGetListPayload((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          checkout_flg: 0,
        },
      }));
      setShowRegisteredEvacuees(!showRegisteredEvacuees);
    });
  };

  /**
   * Show only registered evacuees
   */
  const showOnlyRegisteredEvacuees = async () => {
    setShowRegisteredEvacuees(!showRegisteredEvacuees);
    setSelectedOption("");
    setFamilyCode("");
    setRefugeeName("");
    setSelectedStatusOption(!showRegisteredEvacuees ? 1 : "");
    setTableLoading(true);
    await setGetListPayload((prevState) => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        checkout_flg: showRegisteredEvacuees ? "" : 1,
        place_id: "",
        family_code: "",
        refugee_name: "",
        start: 0,
      },
    }));
  };

  return (
    <React.Fragment>
      <AdminManagementDeleteModal open={deleteOpen} close={onDeleteClose} />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <div className="flex flex-wrap align-items-center justify-content-between">
              <div className="flex align-items-center gap-2 mb-2">
                <CustomHeader
                  headerClass={"page-header1"}
                  customParentClassName={"mb-0"}
                  header={translate(localeJson, "list_of_evacuees")}
                />
                <div className="page-header1-sub mb-2">{`(${totalCount}${translate(
                  localeJson,
                  "people"
                )})`}</div>
              </div>
              <div className="flex flex-wrap align-items-center gap-2">
                <div className="flex flex-wrap  md:justify-content-end md:align-items-end md:gap-4 gap-2 mb-2">
                  <div class="flex gap-2 align-items-center justify-content-center mt-2 md:mt-0 md:mb-2">
                    <span id="showEvacueesSwitchLabel" className="text-sm">
                      {translate(localeJson, "show_checked_out_evacuees")}
                    </span>

                    <InputSwitch
                      inputSwitchProps={{
                        id: "showEvacueesSwitch", // ✅ This assigns id to the inner <input>, not outer <div>
                        checked: showRegisteredEvacuees,
                        onChange: () => showOnlyRegisteredEvacuees(),
                        "aria-labelledby": "showEvacueesSwitchLabel",
                        title: translate(
                          localeJson,
                          "show_checked_out_evacuees"
                        ),
                      }}
                      parentClass="custom-switch"
                    />
                  </div>
                  <div>
                    <Button
                      buttonProps={{
                        type: "button",
                        rounded: "true",
                        delete: true,
                        buttonClass: "export-button",
                        text: translate(localeJson, "bulk_delete"),
                        severity: "primary",
                        disabled:
                          !showRegisteredEvacuees ||
                          evacueesDataList.length <= 0,
                        onClick: () => openDeleteDialog(),
                      }}
                      parentClass={`custom-target-icon export-button`}
                    />
                  </div>
                </div>
                <div>
                  <Button
                    buttonProps={{
                      type: "submit",
                      rounded: "true",
                      export: true,
                      buttonClass: "evacuation_button_height export-button",
                      text: translate(localeJson, "export"),
                      onClick: () => downloadEvacueesListCSV(),
                    }}
                    parentClass={"export-button mb-2"}
                  />
                </div>
              </div>
            </div>
            <div>
              <form>
                <div className="p-fluid formgrid grid mt-3">
                  <div className="field col-12 md:col-3 lg:col-3">
                    <InputDropdown
                      inputDropdownProps={{
                        inputId: "statusDropdown",
                        ariaLabel: translate(localeJson, "status_furigana"),
                        inputDropdownParentClassName: "",
                        labelProps: {
                          text: translate(localeJson, "status_furigana"),
                          inputDropdownLabelClassName: "block",
                          htmlFor: "statusDropdown",
                        },
                        inputDropdownClassName: "",
                        customPanelDropdownClassName: "",
                        value: selectedStatusOption,
                        options: getOptions(locale),
                        optionLabel: "label",
                        onChange: (e) => setSelectedStatusOption(e.value),
                        emptyMessage: (
                          <span
                            aria-live="polite"
                            aria-label={translate(localeJson, "data_not_found")}
                            className="sr-only"
                          >
                            {translate(localeJson, "data_not_found")}
                          </span>
                        ),
                        pt: {
                          trigger: {
                            "aria-label": translate(localeJson, "status_furigana"),
                            title: translate(localeJson, "status_furigana"),
                          },
                          input: {
                            "aria-label": translate(localeJson, "status_furigana"),
                            title: translate(localeJson, "status_furigana"),
                          },
                          select: {
                            "aria-label": translate(localeJson, "status_furigana"),
                            title: translate(localeJson, "status_furigana"),
                          },
                          panel: {
                            "aria-live": "polite",
                            "aria-atomic": "true",
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="field col-12 md:col-3 lg:col-3">
                    <InputDropdown
                      inputDropdownProps={{
                        inputId: "evacuationSiteDropdown",
                        ariaLabel: translate(localeJson, "evacuation_site"),
                        inputDropdownParentClassName: "",
                        labelProps: {
                          text: translate(localeJson, "evacuation_site"),
                          inputDropdownLabelClassName: "block",
                          htmlFor: "evacuationSiteDropdown",
                        },
                        inputDropdownClassName: "",
                        customPanelDropdownClassName: "",
                        value: selectedOption,
                        options: evacuationPlaceList,
                        optionLabel: "name",
                        onChange: (e) => setSelectedOption(e.value),
                        emptyMessage: (
                          <span
                            aria-live="polite"
                            aria-label={translate(localeJson, "data_not_found")}
                            className="sr-only"
                          >
                            {translate(localeJson, "data_not_found")}
                          </span>
                        ),
                        pt: {
                          trigger: {
                            "aria-label": translate(localeJson, "evacuation_site"),
                            title: translate(localeJson, "evacuation_site"),
                          },
                          input: {
                            "aria-label": translate(localeJson, "evacuation_site"),
                            title: translate(localeJson, "evacuation_site"),
                          },
                          select: {
                            "aria-label": translate(localeJson, "evacuation_site"),
                            title: translate(localeJson, "evacuation_site"),
                          },
                          panel: {
                            "aria-live": "polite",
                            "aria-atomic": "true",
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="field col-12 md:col-3 lg:col-3">
                    <Input
                      inputProps={{
                        name: "household_number",
                        id: "household_number",
                        inputParentClassName: "w-full",
                        labelProps: {
                          text: translate(localeJson, "household_number"),
                          inputLabelClassName: "block",
                        },
                        inputClassName: "",
                        value: familyCode,
                        onChange: (e) => handleFamilyCode(e),
                      }}
                    />
                  </div>
                  <div className="field col-12 md:col-3 lg:col-3">
                    <Input
                      inputProps={{
                        id: "refugee_name",
                        name: "refugee_name",
                        inputParentClassName: "w-full",
                        labelProps: {
                          text: translate(localeJson, "name"),
                          inputLabelClassName: "block",
                        },
                        inputClassName: "",
                        value: refugeeName,
                        onChange: (e) => setRefugeeName(e.target.value),
                      }}
                    />
                  </div>
                </div>
                {/* Search Button - OUTSIDE the grid, aligned right */}
                <div className="flex justify-content-end mt-3">
                  <Button
                    buttonProps={{
                      buttonClass:
                        "w-full lg:w-9rem md:w-9rem sm:w-9rem search-button block text-center p-0",
                      text: translate(localeJson, "search_text"),
                      icon: "pi pi-search",
                      type: "button",
                      onClick: () => searchListWithCriteria(),
                    }}
                    parentClass={
                      "search-button w-full flex justify-content-end mb-3"
                    }
                  />
                </div>
              </form>
              <div className="hidden flex justify-content-between">
                <div>
                  <p className="pt-4 page-header2 font-bold">
                    {translate(localeJson, "totalSummary")}: {familyCount}
                  </p>
                </div>
              </div>
            </div>
            <NormalTable
              lazy
              id={"evacuation-list"}
              className="evacuation-list"
              totalRecords={totalCount}
              loading={tableLoading}
              size={"small"}
              stripedRows={true}
              paginator={"true"}
              showGridlines={"true"}
              value={evacueesDataList}
              columns={evacuationTableFields}
              emptyMessage={translate(localeJson, "data_not_found")}
              first={getListPayload.filters.start}
              rows={getListPayload.filters.limit}
              paginatorLeft={true}
              onPageHandler={(e) => onPaginationChange(e)}
              onSort={(data) => {
                setGetListPayload({
                  ...getListPayload,
                  filters: {
                    ...getListPayload.filters,
                    sort_by: data.sortField,
                    order_by:
                      getListPayload.filters.order_by === "desc"
                        ? "asc"
                        : "desc",
                  },
                });
              }}
              selectionMode="single"
              onSelectionChange={(e) => {
                dispatch(setFamily({ family_id: e.value.id }));
                router.push({
                  pathname: "/admin/evacuation/family-detail",
                });
              }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
