import { Button, Link, Paper, Typography, withStyles } from "@mui/material";
import React, { useEffect } from "react";
import METable from "../ME  Tools/table /METable";
import { PAGE_PROPERTIES } from "../ME  Tools/MEConstants";
import { APP_LINKS, DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE_OPTIONS } from "../../../utils/constants";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import { reduxToggleUniversalModal } from "../../../redux/redux-actions/adminActions";
import CopyCustomPageModal, { DeleteCustomPageModalConfirmation } from "./CopyCustomPageModal";
import { useApiRequest } from "../../../utils/hooks/useApiRequest";

const DUMMY_DATA = [
  {
    id: Date.now(),
    name: "Resource Guide",
    community: "Concord",
    access: "Nowhere,Ablekuma,Agawam...",
    creator: "Frimpong",
    published_at: "2021-10-10"
  },
  {
    id: Date.now() + 1,
    name: "Energy Saving Tips",
    community: "Concord",
    access: "Nowhere,Ablekuma,Agawam...",
    creator: "Brad",
    published_at: "2021-10-10"
  },
  {
    id: Date.now() + 2,
    name: "Solar Power 101",
    community: "Wayland",
    access: "Nowhere,Ablekuma,Agawam...",
    creator: "Tahiru",
    published_at: "2021-10-10"
  },
  {
    id: Date.now() + 3,
    name: "Electric Cars",
    community: "Concord",
    access: "Nowhere,Ablekuma,Agawam...",
    creator: "Frimpong",
    published_at: "2021-10-10"
  },
  {
    id: Date.now() + 4,
    name: "Community Solar",
    community: "Framingham",
    access: "Nowhere,Ablekuma,Agawam",
    creator: "Brad",
    published_at: "2021-10-10"
  }
];
function AdminCustomPagesList({ classes }) {
  const [comListRequester, ffRequester] = useApiRequest([
    { key: "communityList", url: "communities.listForCommunityAdmin" },
    { key: "ffList", url: "communities.features.flags.list" },
  ]);

  // const { apiRequest, loading, error, data } = comListRequester || {};
  // const [sdkfjlskdf, sdjfklsdf, sdkfjlksjd, sdfjklsdf] = comListRequester || {};
  // const { apiRequest: ffRequest, loading: ffLoading, error: ffError, data: ff } = ffRequester || {};
  const dispatch = useDispatch();
  const toggleModal = (props) => dispatch(reduxToggleUniversalModal(props));


  const makeColumns = () => {
    return [
      {
        name: "Name",
        key: "name",
        options: {
          filter: false,
          customBodyRender: (name) => {
            return <b>{name}</b>;
          }
        }
      },
      {
        name: "Community",
        key: "community",
        options: {
          filter: false
        }
      },
      {
        name: "Created By",
        key: "created-by",
        options: {
          filter: false
        }
      },
      {
        name: "Access",
        key: "access",
        options: {
          filter: false
        }
      },
      {
        name: "Last Published",
        key: "last-published",
        options: {
          filter: false
        }
      },
      {
        name: "Preview",
        key: "preview",
        options: {
          filter: false
        }
      },

      {
        name: "Actions",
        key: "actions",
        options: {}
      }
    ];
  };

  const fashionData = (data) => {
    return data?.map((d) => {
      return [
        // d.id,
        d.name,
        d.community,
        d.creator,
        <Link href="#" style={{ fontWeight: "bold" }}>
          {d.access}
        </Link>,
        d.published_at,
        <Link href="#" style={{ fontWeight: "bold" }}>
          View Published
        </Link>,

        <div>
          <Link
            color={"secondary"}
            style={{ textTransform: "unset", fontWeight: "bold", textDecoration: "none" }}
            target="_blank"
            href={APP_LINKS.PAGE_BUILDER_CREATE_OR_EDIT}
          >
            <i style={{ marginRight: 5 }} className="fa fa-edit" /> Edit
          </Link>
          <Link
            color="secondary"
            style={{ textTransform: "unset", fontWeight: "bold", textDecoration: "none", marginLeft: 10 }}
            target="_blank"
            // href="/admin/community/configure/navigation/custom-pages"
            onClick={(e) => {
              e.preventDefault();
              console.log("Lets see onclicK'");
              toggleModal({
                show: true,
                noTitle: true,
                fullControl: true,
                // title: "Copy Custom Page",
                component: <CopyCustomPageModal />,
                data: { page: d }
              });
            }}
          >
            <i style={{ marginRight: 5 }} className="fa fa-copy" /> Copy
          </Link>
        </div>
      ];
    });

  };

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    print: true,
    rowsPerPage: DEFAULT_ITEMS_PER_PAGE,
    rowsPerPageOptions: DEFAULT_ITEMS_PER_PAGE_OPTIONS,
    // count: metaData && metaData.count,
    // confirmFilters: true,
    onRowsDelete: (rowsDeleted) => {
      toggleModal({
        show: true,
        noTitle: true,
        fullControl: true,
        // title: "Copy Custom Page",
        component: <DeleteCustomPageModalConfirmation />
      });
      // const idsToDelete = rowsDeleted.data;
      // idsToDelete.forEach((d) => {
      //   const email = data[d.dataIndex][2];
      //   apiCall("/teams.removeMember", { team_id: team.id, email });
      // });
    }
  };

  return (
    <div>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h6">Manage your custom pages</Typography>
        <Typography variant="p" style={{ margin: "10px 0px" }}>
          Here you can create pages for resource guides, and other topics on your your community sites. You can also set
          which communities can make copies of your pages.
        </Typography>
        <div style={{ marginTop: 10 }}>
          <Link
            style={{ textTransform: "unset", fontWeight: "bold", textDecoration: "none" }}
            target="_blank"
            href={APP_LINKS.PAGE_BUILDER_CREATE_OR_EDIT}
            onClick={(e) => {
              e.preventDefault();
              // apiRequest();
            }}
          >
            <i style={{ marginRight: 5 }} className="fa fa-plus" /> Create A Custom Page
            {/* {loading && <i className="fa fa-spinner fa-spin" />} */}
          </Link>
          <Link
            style={{ textTransform: "unset", fontWeight: "bold", textDecoration: "none", marginLeft: 10 }}
            target="_blank"
            href={APP_LINKS.PAGE_BUILDER_CREATE_OR_EDIT}
            onClick={(e) => {
              e.preventDefault();
              // ffRequest();
            }}
          >
            <i style={{ marginRight: 5 }} className="fa fa-plus" /> Request FF
            {/* {ffLoading && <i className="fa fa-spinner fa-spin" />} */}
          </Link>
        </div>
      </Paper>
      <br />

      <METable
        classes={classes}
        page={PAGE_PROPERTIES.CUSTOM_PAGES}
        tableProps={{
          title: "All Custom Pages",
          data: fashionData(DUMMY_DATA),
          columns: makeColumns(),
          options: options
        }}
        //   saveFilters={this.state.saveFilters}
      />
    </div>
  );
}
export default AdminCustomPagesList;
