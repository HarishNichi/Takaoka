import React, { useState, useEffect, useContext } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  OverlayView,
  OverlayViewF,
  DirectionsRenderer,
  DirectionsService,
  LoadScript,
} from "@react-google-maps/api";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";

export const GoogleMapComponent = ({
  initialPosition,
  height,
  searchResult,
  popoverContent,
  mapScale,
}) => {
  const containerStyle = {
    width: "100%",
    height: height || "100vh",
  };
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const [center, setCenter] = useState(initialPosition);
  const { locale, setLoader } = useContext(LayoutContext);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if(initialPosition)
    {
    setCenter(initialPosition);
    }
  }, [initialPosition]);

  useEffect(() => {
    setCenter(searchResult);
  }, [searchResult]);

  useEffect(() => {
    if (searchResult) {
      setCenter(searchResult);
    }
  }, [searchResult]);

  useEffect(() => {
    setLoader(true);
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&language=${locale}`;
    googleMapScript.onload = () => setIsLoaded(true);
    document.head.appendChild(googleMapScript);
    setLoader(false);
    return () => {
      // Cleanup script on component unmount
      document.head.removeChild(googleMapScript);
    };
  }, [locale]);

  const onMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const mapOptions = {
    minZoom: 0, // Set your desired min zoom level
    maxZoom: 25,
    zoom: mapScale || 10,
  };

  const customIcon = {
    url: "/layout/images/map/map_active.png", // Replace with the URL of your custom marker image
  };

  const onLoad = React.useCallback(
    async function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback() {
    setCenter(initialPosition);
  }, []);

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        center={center}
        options={mapOptions}
      >
        {center && (
          <Marker
            position={center}
            onClick={() => onMarkerClick(center)}
            icon={popoverContent ? customIcon : null}
          />
        )}
        {selectedMarker && popoverContent && (
          <>
            <InfoWindow
              position={center}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>{popoverContent}</div>
            </InfoWindow>
          </>
        )}
      </GoogleMap>
    </>
  ) : (
    <></>
  );
};

export const GoogleMapMultiMarkerComponent = ({
  initialPosition,
  height,
  markers,
  searchResult,
  mapScale,
}) => {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const [center, setCenter] = useState(initialPosition);
  const { locale, localeJson, setLoader, loader } = useContext(LayoutContext);
  const [windowHeight, setWindowHeight] = useState(height);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_API_KEY,
    language: locale,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMarker, setIsMarker] = useState(false);
  const [onMouseHoverValue, setOnMouseHoverValue] = useState(false);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(null);
  const [mapOptions, setMapOptions] = useState({
    minZoom: 2,
    maxZoom: 25,
    zoom: mapScale || 10, // Initial zoom level
    gestureHandling: "greedy",
  });
  useEffect(() => {
    setMapOptions((prevOptions) => ({
      ...prevOptions,
      zoom: mapScale || prevOptions.zoom,
    }));
  }, [searchResult]);



  useEffect(() => {
    setWindowHeight(height);
  }, [height]);

  useEffect(() => {
    if(searchResult)
    {
    setCenter(searchResult);
    }
  }, [searchResult]);
  useEffect(() => {
    setCenter(initialPosition);
  }, [initialPosition]);



  const onMarkerClick = (marker) => {
    setIsMarker(true);
    setSelectedMarker(marker);
  };



  const containerStyle = {
    width: "100%",
    height: windowHeight,
    minHeight: "400px",
  };

  const onLoad = React.useCallback(
    function callback(map) {
      if (markers.length > 0) {
        // Fit the map to the bounds of all markers
        if (!mapOptions.zoom) {
          const bounds = new window.google.maps.LatLngBounds();
          markers.forEach((marker) => {
            bounds.extend(marker.position);
          });
          map.fitBounds(bounds);
        } else {
          // If zoom level is set in mapOptions, apply center and zoom manually
          map.setCenter(initialPosition);
          map.setZoom(mapOptions.zoom);
        }
        // Check if the custom control has already been added
        if (!map.customControlAdded) {
          const customControlDiv = document.createElement("div");
          customControlDiv.innerHTML = `
            <div class="legend_view_box" style='position:absolute;left:-195px;top:70px'>
              <div class="legend_main_view">
                <img class="legend_first_view" src=${GreenIcon.url} />
                <div class="legend_second_view">${translate(
            localeJson,
            "empty"
          )}</div>
              </div>
              <div class="legend_main_view">
                <img class="legend_first_view" src=${RedIcon.url} />
                <div class="legend_second_view">${translate(
            localeJson,
            "beginningToCrowd"
          )}</div>
              </div>
              <div class="legend_main_view">
                <img class="legend_first_view" src=${BlueIcon.url} />
                <div class="legend_second_view">${translate(
            localeJson,
            "crowded"
          )}</div>
              </div>
              <div class="legend_main_view">
                <img class="legend_first_view"src=${GrayIcon.url} />
                <div class="legend_second_view">${translate(
            localeJson,
            "closed"
          )}</div>
              </div>
            </div>
          `;

          map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
            customControlDiv
          );

          // Set a flag to indicate that the custom control has been added
          map.customControlAdded = true;

          // Add click event listener to hide the legend on map click
          map.addListener("click", () => {
            customControlDiv.style.display = "none";
          });
        }
      }
    },
    [markers,initialPosition]
  );

  // const onUnmount = React.useCallback(function callback() {
  //   console.log(initialPosition)
  //   setCenter(initialPosition);
  // }, []);

  const RedIcon = {
    url: "/layout/images/map/map_active_red.png",
  };
  const GreenIcon = {
    url: "/layout/images/map/map_active_blue.png",
  };
  const BlueIcon = {
    url: "/layout/images/map/map_active_full.png",
  };
  const GrayIcon = {
    url: "/layout/images/map/map_inactive_gray.png",
  };

  return isLoaded ? (
    <>
      {markers.length > 0 && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          // onUnmount={onUnmount}
          center={center}
          options={mapOptions}
        >
          {markers.length > 0 && (
            <>
              {markers?.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.position}
                  onClick={() => onMarkerClick(marker)}
                  onMouseOver={() => {
                    setHoveredMarkerIndex(index);
                    setOnMouseHoverValue(true);
                  }}
                  onMouseOut={() => {
                    setHoveredMarkerIndex(null);
                    setOnMouseHoverValue(false);
                  }}
                  icon={
                    marker.active_flg == 1
                      ? marker.center >= 81
                        ? BlueIcon
                        : marker.center > 50 && marker.center <= 80
                          ? RedIcon
                          : marker.center >= 0
                            ? GreenIcon
                            : GrayIcon
                      : GrayIcon
                  }
                >
                  <div title={marker.content}>
                    <OverlayViewF
                      position={marker.position}
                      mapPaneName={OverlayView.MARKER_LAYER}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: hoveredMarkerIndex === index && onMouseHoverValue ? "inline-block" : "none",
                          zIndex: "99999"
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            background: "white ",
                            marginTop: "-138px", // Adjust as needed
                            padding: "15px",
                            marginLeft: "-80px",
                            borderRadius: "5px",
                            minWidth: "150px",
                            maxWidth: "150px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "45%",
                              width: "0",
                              height: "0",
                              borderLeft: "10px solid transparent",
                              borderRight: "10px solid transparent",
                              borderTop: "10px solid white",
                            }}
                          ></div>
                          <div
                            className="text-base"
                            style={{ wordWrap: "break-word" }}
                          >
                            {marker.content}
                          </div>
                        </div>
                      </div>
                    </OverlayViewF>
                  </div>
                </Marker>
              ))}
              {isMarker && (
                <div className="selectedMarker shadow-4">
                  <InfoWindow
                    position={selectedMarker.position}
                    onCloseClick={() => {
                      setIsMarker(false);
                      setSelectedMarker(null);
                    }}
                  >
                    <div>
                      {selectedMarker.center >= 0 ? (
                        <div id="content shadow-4 ">
                          <div id="siteNotice"></div>
                          <h1
                            id="firstHeading"
                            className="callout_header text-base"
                            style={{
                              backgroundColor:
                                selectedMarker.active_flg == 1
                                  ? selectedMarker.center >= 81
                                    ? "purple"
                                    : selectedMarker.center > 50 &&
                                      selectedMarker.center <= 80
                                      ? "red"
                                      : selectedMarker.center >= 0
                                        ? "green"
                                        : "gray"
                                  : "gray",
                            }}
                          >
                            {selectedMarker.active_flg == 1
                              ? selectedMarker.center >= 81
                                ? translate(localeJson, "crowded")
                                : selectedMarker.center > 50 &&
                                  selectedMarker.center <= 80
                                  ? translate(localeJson, "beginningToCrowd")
                                  : selectedMarker.center >= 0
                                    ? translate(localeJson, "empty")
                                    : translate(localeJson, "closed")
                              : translate(localeJson, "closed")}
                          </h1>
                          <div
                            id="bodyContent text-base"
                            className="text-base mt-2"
                          >
                            <div className="text-base mb-1 mt-1">
                              {selectedMarker.content}
                            </div>
                            <div className="text-base mb-1">
                              {selectedMarker.address_place}
                            </div>
                            <div className="text-base mb-1">
                              {translate(localeJson, "altitude") +
                                ": " +
                                selectedMarker.altitude}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>{translate(localeJson, "close")}</div>
                      )}
                    </div>
                  </InfoWindow>
                </div>
              )}
            </>
          )}
        </GoogleMap>
      )}
    </>
  ) : (
    <></>
  );
};



export const MapComponent = ({ destination }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const { locale, localeJson, setLoader, loader } = useContext(LayoutContext);
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_API_KEY,
    language: locale,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (isLoaded && currentLocation && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, currentLocation, destination]);

  return isLoaded ? (
    <GoogleMap
      center={currentLocation || destination}
      zoom={12}
      mapContainerStyle={{ height: "400px", width: "100%" }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  ) : (
    <></>
  );
};

