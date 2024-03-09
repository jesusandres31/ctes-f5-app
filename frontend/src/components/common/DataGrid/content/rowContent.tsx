import {
  TableCell,
  Typography,
  Checkbox,
  Tooltip,
  IconButton,
} from "@mui/material";
import { IColumn, Item } from "src/types";
import { formatNulls } from "src/utils";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";

const styles = {
  sticky: {
    position: "sticky",
    paddingBlock: 0,
  },
  stickyMobile: {
    position: "sticky",
    paddingBlock: 0,
    backgroundColor: "background.paper",
    right: 0,
    padding: 0,
    margin: 0,
  },
};

export default function rowContent(
  _index: number,
  row: Item,
  columns: IColumn<Item>[],
  isMobile: boolean,
  isSelected: boolean,
  isCollapsed: boolean,
  handleSelectItem: (itemId: string) => void,
  handleCollapse: (id: string) => void,
  isCollapsible: boolean = true // TODO: make this dynimic
) {
  return (
    <>
      <TableCell padding="checkbox" sx={{ cursor: "pointer" }}>
        <Checkbox
          color="primary"
          checked={isSelected}
          onClick={() => handleSelectItem(row.id)}
        />
      </TableCell>

      {columns.map((column) => {
        const value = column.render
          ? column.render(row)
          : formatNulls(row[column.id]);

        return (
          <TableCell
            height={55}
            component="th"
            scope="row"
            size="small"
            key={column.id}
            align={column.align ?? "right"}
            sx={{ cursor: "pointer" }}
            onClick={() => handleSelectItem(row.id)}
          >
            <Tooltip title={value}>
              <Typography
                variant="subtitle2"
                noWrap
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {typeof value === "string"
                  ? value.charAt(0).toUpperCase() + value.slice(1)
                  : value}
              </Typography>
            </Tooltip>
          </TableCell>
        );
      })}

      {isCollapsible ? (
        <TableCell
          sx={isMobile ? styles.stickyMobile : styles.sticky}
          onClick={() => handleCollapse(row.id)}
        >
          <IconButton>
            {isCollapsed ? (
              <KeyboardArrowUpRounded />
            ) : (
              <KeyboardArrowDownRounded />
            )}
          </IconButton>
        </TableCell>
      ) : null}
    </>
  );
}
