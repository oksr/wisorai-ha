import * as React from "react";
import PropTypes from "prop-types";
import SvgIcon from "@mui/material/SvgIcon";
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
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
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
    </Stack>
  );
};
function createHierarchyofEmployees(employees) {
  const employeesMap = employees.reduce((acc, employee) => {
    acc[employee.id] = employee;
    return acc;
  }, {});

  // it should handle duplicate managers

  const employeesHierarchy = employees.reduce((acc, employee) => {
    const manager = employeesMap[employee.manager_id];
    if (manager) {
      if (!manager.subordinates) {
        manager.subordinates = []; // this will mutate the original data
        // create a new array instead
      }
      // it should handle duplicate employees, so we should check if the employee is already in the subordinates list
      if (!manager.subordinates.find((subordinate) => subordinate.id === employee.id)) {
        manager.subordinates.push(employee);
      }
    } else {
      acc.push(employee);
    }
    return acc;
  }, []);

  return employeesHierarchy;
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
      sx={{ height: "100vh", flexGrow: 1, maxWidth: "100%", overflowY: "auto" }}
    >
      {/* A list of all employees (avatar, full name and email address)  */}
      {employeesHierarchy.map((employee) => (
        <StyledTreeItem
          key={employee.id}
          nodeId={employee.id}
          label={<CustomTreeItem props={employee} />}
        >
          {/* A list of all subordinates (avatar, full name and email address) */}
          {employee.subordinates &&
            employee.subordinates.map((subordinate) => (
              <StyledTreeItem
                key={subordinate.id}
                nodeId={subordinate.id}
                label={<CustomTreeItem props={subordinate} />}
              >
                {/* A list of all subordinates (avatar, full name and email address) */}
                {subordinate.subordinates &&
                  subordinate.subordinates.map((subordinate) => (
                    <StyledTreeItem
                      key={subordinate.id}
                      nodeId={subordinate.id}
                      label={<CustomTreeItem props={subordinate} />}
                    />
                  ))}
              </StyledTreeItem>
            ))}
        </StyledTreeItem>
      ))}
    </TreeView>
  );
}
