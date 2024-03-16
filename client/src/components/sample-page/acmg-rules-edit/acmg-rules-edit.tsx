import React, { useState } from "react";
import styles from "./acmg-rules-edit.module.scss";
import Icon from "../../../atoms/icon/icon";
import { SampleService } from "../../../services/sample/sample.service";
import { IAcmgRule } from "../../../models/acmg-rule.model";

type AcmgRulesEditProps = {
  sampleId: string;
  variantId: number;
  variantAcmgRules: IAcmgRule[];
  allAcmgRules: IAcmgRule[];
  sampleService: SampleService;
};

const AcmgRulesEdit: React.FunctionComponent<AcmgRulesEditProps> = (
  props: AcmgRulesEditProps
) => {
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
  const [selectedAcmgRules, setSelectedAcmgRules] = useState(
    props.variantAcmgRules ?? []
  );
  const [mouseOverRule, setMouseOverRule] = useState<number>(undefined);

  return (
    <div className={styles.acmg}>
      {/** Selected Acmg Rules */}
      {selectedAcmgRules?.map((r) => {
        const styleClass = r.name.substring(0, r.name.length - 1).toLowerCase();

        return (
          <div
            onMouseOver={() => setMouseOverRule(r.id)}
            onMouseLeave={() => setMouseOverRule(undefined)}
            className={`${styles["selected-acmg"]} ${styles[`${styleClass}`]}`}
          >
            {mouseOverRule === r.id ? (
              <Icon
                name="bin"
                className={styles.bin}
                onClick={() => removeAcmgRule(r.id)}
              />
            ) : (
              r.name
            )}
          </div>
        );
      })}

      {/** Add Menu */}
      {isAddMenuVisible ? (
        <div className={styles["add-menu"]}>
          <Icon
            name="add"
            fill="white"
            width={20}
            height={20}
            className={styles["add-menu-icon"]}
            onClick={() => setIsAddMenuVisible(false)}
          />
          {getAvailableAcmgRules().map((r) => {
            return <div onClick={() => addAcmgRule(r.id)}>{r.name}</div>;
          })}
        </div>
      ) : (
        <Icon
          className={styles["add-acmg"]}
          name="add-outline"
          fill="white"
          width={37}
          height={37}
          onClick={() => {
            if (getAvailableAcmgRules().length > 0) {
              setIsAddMenuVisible(true);
            }
          }}
        />
      )}
    </div>
  );

  function addAcmgRule(rule_id: number) {
    setSelectedAcmgRules(
      selectedAcmgRules.concat(props.allAcmgRules.find((r) => r.id === rule_id))
    );

    props.sampleService.addAcmgRule({
      sampleId: props.sampleId,
      variantId: props.variantId,
      ruleId: rule_id,
    });
  }

  function removeAcmgRule(rule_id: number) {
    setSelectedAcmgRules(selectedAcmgRules.filter((r) => r.id !== rule_id));

    props.sampleService.removeAcmgRule({
      sampleId: props.sampleId,
      variantId: props.variantId,
      ruleId: rule_id,
    });
  }

  function getAvailableAcmgRules() {
    const availableAcmgRules = props.allAcmgRules.filter(
      (r) => !selectedAcmgRules?.includes(r)
    );

    return availableAcmgRules;
  }
};

export default AcmgRulesEdit;
