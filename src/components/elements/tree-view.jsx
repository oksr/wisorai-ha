import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Stack, Avatar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function TransitionComponent(props) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  in: PropTypes.bool,
};

export const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    marginTop: 4,
    marginBottom: 4,
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const CustomTreeItem = ({ props }) => {
  const navigate = useNavigate();
  const { nodeId, label, children, first_name, last_name, email, profile_pic, ...other } = props;
  const calcnodes = (props) => {
    let count = 0;
    if (props.nodes) {
      count += props.nodes.length;
      props.nodes.forEach((child) => {
        count += calcnodes(child);
      });
    }
    return count;
  };
  const MemoizedCalcnodes = useMemo(() => calcnodes, []);

  const nodesCount = MemoizedCalcnodes(props);

  return (
    <Stack direction="row" alignItems="center" spacing={2} onClick={() => navigate(`${props.id}`)}>
      <Avatar alt={first_name} src={profile_pic} sx={{ width: 32, height: 32 }} />
      <Typography variant="body2" noWrap>
        {first_name} {last_name}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {email}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {nodesCount > 0 ? `${nodesCount} employees` : ""}
      </Typography>
    </Stack>
  );
};

function renderNodes(nodes) {
  return nodes.map((child) => (
    <StyledTreeItem key={child.id} nodeId={child.id} label={<CustomTreeItem props={child} />}>
      {child.nodes && renderNodes(child.nodes)}
    </StyledTreeItem>
  ));
}

export default function CustomizedTreeView() {
  const employeesHierarchy = useSelector((state) => state.employee.employeesTree);
  // const { pathname } = useLocation();
  // const id = pathname.split("/")[1];
  return (
    <TreeView
      aria-label="customized"
      defaultExpanded={["1"]}
      defaultCollapseIcon={<FiChevronDown />}
      defaultExpandIcon={<FiChevronRight />}
      defaultEndIcon={<FiChevronRight opacity={"0.3"} />}
      sx={{
        height: "100vh",
        flexGrow: 1,
        maxWidth: "100%",
        overflowY: "auto",
        borderRight: 1,
        borderColor: "divider",
      }}
      onNodeSelect={(event, nodeIds) => {
        console.log("nodeIds", nodeIds);
      }}
    >
      {employeesHierarchy.map((employee) => (
        <StyledTreeItem
          key={employee.id}
          nodeId={employee.id}
          label={<CustomTreeItem props={employee} />}
        >
          {employee.nodes && renderNodes(employee.nodes)}
        </StyledTreeItem>
      ))}
    </TreeView>
  );
}
