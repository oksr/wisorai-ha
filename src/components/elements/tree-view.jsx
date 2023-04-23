import * as React from "react";
import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Stack, Avatar, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentEmployee } from "../../redux/employeeSlice";

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

const StyledTreeItem = styled((props) => (
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
  const dispatch = useDispatch();
  const { nodeId, label, children, first_name, last_name, email, profile_pic, ...other } = props;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      onClick={() => dispatch(setCurrentEmployee(props))}
    >
      <Avatar alt={first_name} src={profile_pic} sx={{ width: 32, height: 32 }} />
      <Typography variant="body2" noWrap>
        {first_name} {last_name}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {email}
      </Typography>
      {props.subordinates && (
        <Typography variant="body2" color="text.accent" noWrap>
          {props.subordinates.length} employees
        </Typography>
      )}
    </Stack>
  );
};

function renderSubordinates(subordinates) {
  return subordinates.map((subordinate) => (
    <StyledTreeItem
      key={subordinate.id}
      nodeId={subordinate.id}
      label={<CustomTreeItem props={subordinate} />}
    >
      {subordinate.subordinates && renderSubordinates(subordinate.subordinates)}
    </StyledTreeItem>
  ));
}

export default function CustomizedTreeView() {
  const employeesHierarchy = useSelector((state) => state.employee.employeesTree);

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
    >
      {employeesHierarchy.map((employee) => (
        <StyledTreeItem
          key={employee.id}
          nodeId={employee.id}
          label={<CustomTreeItem props={employee} />}
        >
          {employee.subordinates && renderSubordinates(employee.subordinates)}
        </StyledTreeItem>
      ))}
    </TreeView>
  );
}
