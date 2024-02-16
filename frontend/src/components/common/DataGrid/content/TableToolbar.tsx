import { ChangeEvent } from "react";
import {
  Grid,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  lighten,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import {
  AddRounded,
  CreateRounded,
  DeleteForeverRounded,
  SearchRounded,
  ClearRounded,
} from "@mui/icons-material";
import { openModal, useUISelector } from "src/slices/ui/uiSlice";
import { CustomButton, CustomIconButton } from "./utils";
import { Entity } from "src/types";
import { useAppDispatch } from "src/app/store";

interface TableToolbarProps {
  selectedItems: string[];
  isMobile: boolean;
  onClickClear: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  entity: Entity;
}

export default function TableToolbar({
  selectedItems,
  isMobile,
  onClickClear,
  onChange,
  entity,
}: TableToolbarProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isSomeSelected = selectedItems.length > 0;
  const isOneSelected = selectedItems.length === 1;
  const { filter } = useUISelector((state) => state.ui);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        flex: "0 0 auto",
        py: 3,
        backgroundColor: isSomeSelected
          ? lighten(theme.palette.primary.light, 0.8)
          : theme.palette.background.paper,
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ height: 55 }}
      >
        <Grid
          item
          sx={{
            display: "flex",
            alignItems: "center",
            width: isSomeSelected ? "50%" : "100%",
          }}
        >
          {isSomeSelected ? (
            <Typography
              variant={isMobile ? "subtitle2" : "subtitle1"}
              id="tableTitle"
              component="div"
              color="text.primary"
            >
              {`${selectedItems.length} items selected`}
            </Typography>
          ) : (
            <Grid
              container
              alignItems="center"
              sx={{ gap: 2, width: "100%" }}
              direction="row"
            >
              <Grid item sx={{ flex: 1, maxWidth: 450 }}>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ my: -1, width: "100%" }}
                >
                  <InputLabel>Search</InputLabel>
                  <OutlinedInput
                    value={filter}
                    onChange={onChange}
                    startAdornment={
                      <InputAdornment
                        position="start"
                        sx={{ color: theme.palette.text.disabled }}
                      >
                        <SearchRounded />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={onClickClear}>
                          <ClearRounded />
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Search"
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <CustomButton
                  text="Create"
                  icon={<AddRounded />}
                  onClick={() =>
                    dispatch(openModal({ entity, action: "create" }))
                  }
                  isMobile={isMobile}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            {isOneSelected || isSomeSelected ? (
              <Grid item>
                <Grid container alignItems="center" sx={{ gap: 2 }}>
                  {isOneSelected && (
                    <CustomIconButton
                      text="Update"
                      icon={<CreateRounded />}
                      onClick={() => {}}
                      isMobile={isMobile}
                    />
                  )}
                  {isSomeSelected && (
                    <CustomIconButton
                      text="Remove"
                      icon={<DeleteForeverRounded />}
                      onClick={() =>
                        dispatch(openModal({ entity, action: "delete" }))
                      }
                      isMobile={isMobile}
                    />
                  )}
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
}
