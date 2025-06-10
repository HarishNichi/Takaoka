import React, { useContext, useState } from "react";

import { Button, ButtonRounded, UserEventRegModal, CustomHeader } from "@/components";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";

const CommonPage = ({
  firstButtonClick,
  secondButtonClick,
  tittle,
}) => {
  const { localeJson } = useContext(LayoutContext);

  const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);

  return (
    <>
      <UserEventRegModal
        open={specialCareEditOpen}
        header={translate(localeJson, "per_info")}
        buttonText={translate(
          localeJson, "submit"
        )}
        close={() => {
          setSpecialCareEditOpen(false)
        }}
      />
      <div className="flex flex-1 w-full h-full">
        <div className="grid w-full">
          <div className="col-12 flex justify-content-center">
            <div className="card h-full  w-full lg:w-9 flex flex-column justify-content-center">
              <CustomHeader
                headerClass={
                  "page-header1 white-space-nowrap overflow-hidden text-overflow-ellipsis"
                }
                header={tittle}
              />

              <div>
                <div className="mt-3">
                  <div className="flex" style={{ justifyContent: "center" }}>
                    <div className="grid w-full">
                      <div className="col-12 lg:col-6 md:col-6">
                        <ButtonRounded
                          buttonProps={{
                            type: "button",
                            rounded: "true",
                            custom: "userDashboard",
                            buttonClass:
                              "flex align-items-center justify-content-center evacuation_button_height update-button",
                            text: translate(localeJson, "scan_my_card_search"),
                            icon: (
                              <img
                                src="/layout/images/Card.png"
                                width={"30px"}
                                height={"30px"}
                                alt="scanner"
                              />
                            ),
                            onClick: firstButtonClick,
                          }}
                          parentClass={"userParentDashboard update-button"}
                        />
                      </div>
                      <div className="flex flex-column col-12 lg:col-6 md:col-6">
                        <ButtonRounded
                          buttonProps={{
                            type: "button",
                            rounded: "true",
                            custom: "userDashboard",
                            buttonClass:
                              "flex align-items-center justify-content-center evacuation_button_height update-button",
                            text: translate(
                              localeJson,
                              "scan_my_yapple_card_search"
                            ),
                            icon: (
                              <img
                                src="/layout/images/Scanner.png"
                                width={"30px"}
                                height={"30px"}
                                alt="scanner"
                              />
                            ),
                            onClick: () => {
                              secondButtonClick();
                            },
                          }}
                          parentClass={"update-button  userParentDashboard"}
                        />
                      </div>
                    </div>
                  </div>
                  {window.location.pathname.startsWith('/user/register/member') && (
                    <div className="flex align-items-center justify-content-center">
                      <Button
                        buttonProps={{
                          type: "button",
                          text: translate(localeJson, 'manual_admission'),
                          onClick: () => setSpecialCareEditOpen(true),
                          link: "true",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonPage;
