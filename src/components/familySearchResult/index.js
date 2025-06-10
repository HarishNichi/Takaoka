import React, { useState, useContext } from "react";

import {
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { CustomHeader } from "@/components";

const FamilyListComponent = ({ data, header, eventFlag }) => {
  const { locale, localeJson } = useContext(LayoutContext);

  const [expandedFamilies, setExpandedFamilies] = useState([]);

  const toggleExpansion = (personId) => {
    setExpandedFamilies((prevExpanded) =>
      prevExpanded.includes(personId)
        ? prevExpanded.filter((id) => id !== personId)
        : [...prevExpanded, personId]
    );
  };

  const getGenderValue = (gender) => {
    if (gender == 1) {
      return translate(localeJson, "c_male");
    } else if (gender == 2) {
      return translate(localeJson, "c_female");
    } else {
      return translate(localeJson, "c_others_count");
    }
  };

  const getRegisteredLanguage = (language) => {
    if (language == "en") {
      return translate(localeJson, "english");
    } else {
      return translate(localeJson, "japanese");
    }
  };

  return (
    <div>
      <div className="flex justify-content-start font-bold text-5xl mb-3 mt-3">
        {header}
      </div>
      {data?.map((family, index) => (
        <div key={index}>
          {family.person_is_owner == 0 && (
            <div>
              <CustomHeader
                headerClass={"page-header1"}
                header={translate(localeJson, "house_hold_information")}
              />
              <div className="mt-3 mb-2">
                <div className=" flex_row_space_between">
                  <label className="header_table">
                    {translate(localeJson, "rep_kanji")}
                  </label>
                </div>
                <div className=" mt-1 body_table" id="address">
                  {family.person_name || "-"}
                </div>
              </div>
              <div className=" mb-2">
                <div className=" flex_row_space_between">
                  <label className="header_table">
                    {translate(localeJson, "rep_furigana")}
                  </label>
                </div>
                <div className=" mt-1 body_table" id="address">
                  {family.person_refugee_name}
                </div>
              </div>
              <div className="mb-2">
                <label className="header_table">
                  {translate(localeJson, "address")}
                </label>
                <div className="mt-1 body_table">
                  <div className="mt-1 body_table">
                    <div>{family.family_zip_code}</div>
                    <div>
                      {family.prefecture_name}
                      {family.family_address}
                      {family.family_address_default}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <label className="header_table">
                  {translate(localeJson, "family_code")}
                </label>
                <div className="mt-1 body_table">
                  {family.family_code || "-"}
                </div>
              </div>
              <div className="mb-2">
                <label className="header_table">
                  {translate(localeJson, "c_registered_lang_environment")}
                </label>
                <div className="mt-1 body_table">
                  {getRegisteredLanguage(family.family_language_register)}
                </div>
              </div>

              <div className="">
                <label className="header_table">
                  {translate(localeJson, "phone_number")}
                </label>
                <div className="mt-1 body_table">
                  {family.family_tel!= "00000000000" ? family.family_tel : "-"}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="household-register">
        {!eventFlag && data?.map((family, index) => (
          <div key={index}>
            <div
              key={family.f_id}
              className="flex flex-column bg-gray-300 border-round-xl household-space p-2 justify-content-center"
            >
              <div className=" flex_row_space_between mb-3">
                <label className="page-header1">
                  {index + 1}
                  {translate(localeJson, "per_information")}
                  {family.person_is_owner == 0
                    ? "（" + translate(localeJson, "c_representative") + "）"
                    : ""}
                </label>
              </div>
              <div className="ml-2">
                <div className="flex flex-column">
                  <div>
                    <div className="mb-2">
                      <div className=" flex_row_space_between">
                        <label className="header_table">
                          {translate(localeJson, "name_kanji")}
                        </label>
                      </div>
                      <div className="body_table">{family.person_name || "-"}</div>
                    </div>
                    <div className="mb-2">
                      <div className=" flex_row_space_between">
                        <label className="header_table">
                          {translate(localeJson, "c_refugee_name")}
                        </label>
                      </div>
                      <div className="body_table">
                        {family.person_refugee_name}
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="header_table">
                        {translate(localeJson, "address")}
                      </label>
                      <div className="mt-1 body_table">
                        <div>{family.person_postal_code}</div>
                        <div className="mb-2">
                          {family.prefecture_name}
                          {family.person_address}
                          {family.person_address_default}
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="header_table">
                          {translate(localeJson, "family_code")}
                        </label>
                        <div className="mt-1 body_table">
                          {family.family_code || "-"}
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="header_table">
                          {translate(
                            localeJson,
                            "c_registered_lang_environment"
                          )}
                        </label>
                        <div className="mt-1 body_table">
                          {getRegisteredLanguage(
                            family.family_language_register
                          )}
                        </div>
                      </div>

                      <div className="mb-2">
                        <label className="header_table">
                          {translate(localeJson, "phone_number")}
                        </label>
                        <div className="mt-1 body_table">
                          {family.person_tel != "00000000000" ?family.person_tel: "-"}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="header_table">
                        {translate(localeJson, "gender")}
                      </label>
                      <div className="mt-1 body_table">
                        {getGenderValue(family.person_gender)}
                      </div>
                    </div>
                    {expandedFamilies?.includes(family.person_id) && (
                      <div className="mb-2">
                        <div className="mb-2">
                          <label className="header_table">
                            {translate(localeJson, "c_dob")}
                          </label>
                          <div className="mt-1 body_table">
                            {locale == "ja"
                              ? getJapaneseDateDisplayYYYYMMDDFormat(
                                family.person_dob
                              )
                              : getEnglishDateDisplayFormat(family.person_dob)}
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="header_table">
                            {translate(localeJson, "c_age")}
                          </label>
                          <div className="mt-1 body_table">
                            {family.person_age}
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="header_table">
                            {translate(localeJson, "c_age_month")}
                          </label>
                          <div className="mt-1 body_table">
                            {family.person_month != null
                              ? family.person_month
                              : "-"}
                          </div>
                        </div>
                        <div className="mb-2 hidden">
                          <label className="header_table">
                            {translate(localeJson, "c_connecting_code")}
                          </label>
                          <div className="mt-1 body_table">
                            {family.person_connecting_code || "-"}
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="header_table">
                            {translate(localeJson, "c_special_care_type")}
                          </label>
                          <div className="mt-1 body_table">
                            {family.person_special_cares?.length > 0
                              ? family.person_special_cares?.map(
                                (specialCare, index) => (
                                  <span key={index}>
                                    {locale == "ja"
                                      ? specialCare.name
                                      : specialCare.name_en}
                                    {index <
                                      family.person_special_cares.length -
                                      1 && ", "}
                                  </span>
                                )
                              )
                              : "-"}
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="header_table">
                            {translate(localeJson, "c_remarks")}
                          </label>
                          <div className="mt-1 body_table">
                            {family.person_note || "-"}
                          </div>
                        </div>
                        {family?.person_answers.map((answer) => (
                          <div key={answer.question_id}>
                            <div>
                              <label className="header_table">
                                {locale == "ja" ? answer.title : answer.title_en}
                              </label>
                              <div className="mt-1 body_table">
                                {answer.answer ? (locale == "ja" ? answer.answer.join(", ") : answer.answer_en.join(", ")) : "-"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className=" flex justify-content-center align-items-center text-custom-color font-bold">
                      <div
                        onClick={() => toggleExpansion(family.person_id)}
                        className="cursor-pointer flex align-items-center"
                      >
                        <i
                          className={`pi mr-2 font-bold ${expandedFamilies.includes(family.person_id)
                            ? "pi-chevron-up"
                            : "pi-chevron-down"
                            }`}
                        ></i>
                        {expandedFamilies.includes(family.person_id)
                          ? translate(localeJson, "see_details")
                          : translate(localeJson, "see_details")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        {!eventFlag && data?.map((family, index) => (
          <div key={index}>
            <div>
              {index == 0 && (
                <div className="household-register mb-4">
                  <CustomHeader
                    header={translate(localeJson, "evacuee_damage_info")}
                    headerClass={"page-header2"}
                  />
                </div>
              )}
            </div>
            {index == 0 &&
              family?.family_answers.map((answer) => (
                <div key={answer.question_id} className="mb-2">
                  <div>
                    <label className="header_table">{locale == "ja" ? answer.title : answer.title_en}</label>
                    <div className="mt-1 body_table">
                      {answer.answer ? (locale == "ja" ? answer.answer.join(", ") : answer.answer_en.join(", ")) : "-"}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyListComponent;
