import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MediaLibrary from "../ME  Tools/media library/MediaLibrary";
import {
  reduxAddToGalleryImages,
  reduxLoadGalleryImages,
  reduxLoadImageInfos,
  testRedux,
  universalFetchFromGallery,
} from "../../../redux/redux-actions/adminActions";
import { apiCall } from "../../../utils/messenger";
import { Checkbox, FormControlLabel, Typography, Tooltip } from "@mui/material";
import { makeLimitsFromImageArray } from "../../../utils/common";
import { ProgressCircleWithLabel } from "../Gallery/utils";
import { getMoreInfoOnImage } from "../Gallery/Gallery";
//import { Link } from "react-router-dom";
import GalleryFilter from "../Gallery/tools/GalleryFilter";
import { filters } from "../Gallery/Gallery";
import { ShowTagsOnPane } from "../Gallery/SideSheet";
import MediaLibraryForm from "./MediaLibraryForm";

const DEFAULT_SCOPE = ["all", "uploads", "actions", "events", "testimonials"];
export const FormMediaLibraryImplementation = (props) => {
  const {
    fetchImages,
    auth,
    imagesObject,
    putImagesInRedux,
    tags,
    selected,
    defaultValue,
    addOnToWhatImagesAreInRedux,
    communities,
  } = props;
  const [available, setAvailable] = useState(auth && auth.is_super_admin);
  const [selectedTags, setSelectedTags] = useState({ scope: DEFAULT_SCOPE });
  const [queryHasChanged, setQueryHasChanged] = useState(false);
  const [userSelectedImages, setUserSelectedImages] = useState([]);
  const [mlibraryFormData, setmlibraryFormData] = useState({});

  useEffect(() => {
    // The value of "preselected" could either be a list of numbers(ids), or a list of objects(json image objects from backend)
    // This happens because when the page loads afresh, and we pass down images as default value in some "formGenerator JSON", it comes in as objects
    // But then, when the user goes around and selects images from the library, the form generator is setup to only
    // make use of the ID values on the image objects (because that is all we need it to send to the backend)
    const preselected = selected || defaultValue;
    if (!preselected || !preselected.length) return;
    // ---- And whats happening here?
    // So, in the case that a page is laoding for the first time and the images come in as objects, and not
    // as numbers, there is a big chance that images might not be in the list of the whole data set of
    // images given to the media library(because we load all images in small chunks...).
    // So here, we just add it on to the whole list in redux. Thats all we are doing here(just making them available in the whole set).
    // When the userSelected values get into the MediaLibrary component itself, it will still be able to retrieve the selected images whether they are a list of Ids, or the actual images objects
    const theyAreImageObjects = typeof preselected[0] !== "number";
    if (theyAreImageObjects)
      addOnToWhatImagesAreInRedux({ old: imagesObject, data: preselected });
    setUserSelectedImages(preselected);
  }, [selected, defaultValue]);

  const loadMoreImages = (cb) => {
    if (!auth) return console.log("It does not look like you are signed in...");

    const scopes = (selectedTags.scope || []).filter((s) => s != "all");
    var tags = Object.values(selectedTags.tags || []);
    var spread = [];
    for (let t of tags) spread = [...spread, ...t];

    fetchImages({
      body: {
        any_community: auth.is_super_admin && !auth.is_community_admin,
        filters: scopes,
        target_communities: (auth.admin_at || []).map((c) => c.id),
        tags: spread,
      },
      old: queryHasChanged ? {} : imagesObject,
      cb: () => {
        cb && cb();
        setQueryHasChanged(false);
      },
      append: !queryHasChanged, //Query Changes? Dont append new  content retrieved. If it doesnt, append all new search results
    });
  };

  // This is the fxn that is being used in the modal footer "upload & insert"
  // Now, it just switches to the media library form
  const handleUpload = (files, reset, _, changeTabTo, immediately) => {
    changeTabTo("upload-form");
  };

  const doUpload = (files, reset, _, changeTabTo, immediately) => {
    const isUniversal = available ? { is_universal: true } : {};
    const apiJson = {
      user_id: auth.id,
      community_ids: ((auth && auth.admin_at) || []).map((com) => com.id),
      title: "Media library upload",
      ...isUniversal,
    };
    /**
     * Upload all selected files to the backend,
     * B.E will return the URL of all the images uploaded successfully,
     * Add the image urls to the list of items in the library locally, and change tabs
     * So that users see the effect of thier upload right away
     */
    Promise.all(
      files.map((file) => apiCall("/gallery.add", { ...apiJson, file: file }))
    )
      .then((response) => {
        var images = response.map(
          (res) => (res.data && res.data.image) || null
        );
        putImagesInRedux({
          data: makeLimitsFromImageArray(images),
          old: imagesObject,
          append: true,
          prepend: true,
        });
        if (immediately) return immediately(images, response);
        reset();
        changeTabTo(MediaLibrary.Tabs.LIBRARY_TAB);
      })
      .catch((e) => {
        console.log("Sorry, there was a problem uploading some items...: ", e);
      });
  };

  const extras = {
    [MediaLibrary.Tabs.UPLOAD_TAB]: (
      <UploadIntroductionComponent
        auth={auth}
        available={available}
        setAvailableTo={setAvailable}
      />
    ),
  };

  const uploadAndSaveForm = (props) => {
    console.log("HEre it is I have been clicked man", mlibraryFormData);
  };

  return (
    <div>
      <MediaLibrary
        defaultTab={MediaLibrary.Tabs.UPLOAD_TAB}
        images={(imagesObject && imagesObject.images) || []}
        actionText="Select From Library"
        sourceExtractor={(item) => item && item.url}
        renderBeforeImages={
          <GalleryFilter
            dropPosition="left"
            style={{
              marginLeft: 10,
              color: "#00BCD4",
              fontWeight: "bold",
            }}
            selections={selectedTags}
            onChange={(items) => {
              setSelectedTags(items);
              setQueryHasChanged(true);
            }}
            scopes={[{ name: "All", value: "all" }, ...filters]}
            tags={tags}
            label={
              <small style={{ marginRight: 7 }}>
                Add filters to tune your search
              </small>
            }
            reset={() => setSelectedTags({})}
            apply={loadMoreImages}
          />
        }
        useAwait={true}
        onUpload={handleUpload}
        uploadMultiple
        accept={MediaLibrary.AcceptedFileTypes.Images}
        multiple={false}
        extras={extras}
        sideExtraComponent={(props) => {
          return (
            <>
              <SideExtraComponent {...props} />{" "}
              <ShowTagsOnPane
                tags={props.image && props.image.tags}
                style={{ padding: 5 }}
              />
            </>
          );
        }}
        TooltipWrapper={({ children, title, placement }) => {
          return (
            <Tooltip title={title} placement={placement || "top"}>
              {children}
            </Tooltip>
          );
        }}
        tabModifiers={{
          [MediaLibrary.Tabs.LIBRARY_TAB]: {
            name: "Choose From Media Library",
          },
        }}
        {...props}
        selected={userSelectedImages}
        loadMoreFunction={loadMoreImages}
        customTabs={[
          {
            tab: {
              headerName: "Information",
              key: "upload-form",
              component: (
                <MediaLibraryForm
                  auth={auth}
                  onChange={(data) => setmlibraryFormData(data)}
                  communities={communities}
                />
              ),
            },
            renderContextButton: (props) => (
              <MediaLibrary.Button onClick={() => uploadAndSaveForm(props)}>
                DONE!
              </MediaLibrary.Button>
            ),
          },
        ]}
      />
    </div>
  );
};

FormMediaLibraryImplementation.propTypes = {
  props: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.getIn(["auth"]),
  imagesObject: state.getIn(["galleryImages"]),
  tags: state.getIn(["allTags"]),
  communities: state.getIn(["communities"]),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchImages: universalFetchFromGallery,
      fireTestFunction: testRedux,
      putImagesInRedux: reduxLoadGalleryImages,
      addOnToWhatImagesAreInRedux: reduxAddToGalleryImages,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormMediaLibraryImplementation);

const UploadIntroductionComponent = ({ auth, setAvailableTo, available }) => {
  const comms = (auth.admin_at || []).map((c) => c.name).join(", ");
  const is_community_admin =
    auth && auth.is_community_admin && !auth.is_super_admin;

  return (
    <div>
      {comms && is_community_admin && (
        <>
          <div>
            The images you upload here will be available to <b>{comms}</b>{" "}
          </div>
        </>
      )}
      {/* we are disabling sharing images to other communities for now
      {is_community_admin && (
        <FormControlLabel
          label="Make the image(s) available to other communities"
          control={
            <Checkbox
              checked={available}
              onChange={() => setAvailableTo(!available)}
            />
          }
        />
      )}
       <div>
        <Link to="/admin/gallery/add">
          Upload an image for specific communities instead
        </Link>
        </div> 
        */}
    </div>
  );
};

// ------------------------------------
const ComponentForSidePane = ({ image, imageInfos, putImageInfoInRedux }) => {
  const [imageInfo, setImageInfo] = useState("loading");
  useEffect(() => {
    getMoreInfoOnImage({
      id: image && image.id,
      updateStateWith: setImageInfo,
      updateReduxWith: putImageInfoInRedux,
      imageInfos,
    });
  }, []);
  if (imageInfo === "loading") return <ProgressCircleWithLabel />;
  if (!imageInfo) return <></>;
  var informationAboutImage = (imageInfo && imageInfo.information) || {};
  var uploader = informationAboutImage.user;
  informationAboutImage = informationAboutImage.info || {};
  const { size_text, description } = informationAboutImage;

  return (
    <>
      {(size_text || description || uploader) && (
        <div style={{ marginBottom: 15 }}>
          <Typography variant="body2" style={{ marginBottom: 5 }}>
            <i>
              Uploaded by <b>{(uploader && uploader.full_name) || "..."}</b>
            </i>
          </Typography>
          {size_text && (
            <Typography
              variant="h6"
              color="primary"
              style={{ marginBottom: 6, fontSize: "medium" }}
            >
              Size: {size_text}
            </Typography>
          )}
          {description && (
            <>
              <Typography variant="body2">
                <b>Description</b>
              </Typography>
              <Typography variant="body2">{description}</Typography>
            </>
          )}
        </div>
      )}
    </>
  );
};

const stateToProps = (state) => {
  return {
    imageInfos: state.getIn(["imageInfos"]),
  };
};

const dispatchToProps = (dispatch) => {
  return bindActionCreators(
    { putImageInfoInRedux: reduxLoadImageInfos },
    dispatch
  );
};
const SideExtraComponent = connect(
  stateToProps,
  dispatchToProps
)(ComponentForSidePane);
