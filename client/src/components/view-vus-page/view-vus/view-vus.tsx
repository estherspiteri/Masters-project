import React, { useEffect, useRef, useState } from "react";
import styles from "./view-vus.module.scss";
import { IVus } from "../../../models/view-vus.model";

type ViewVusProps = {
  vus?: IVus;
  isColoured?: boolean;
  showGenotype?: boolean;
  showZygosityQty?: boolean;
};

const ViewVus: React.FunctionComponent<ViewVusProps> = (
  props: ViewVusProps
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAdditionalInfoVisible, setIsAdditionalInfoVisible] = useState(false);

  //close additional info on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsAdditionalInfoVisible(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      className={`${styles["view-vus-container"]} ${
        props.isColoured ? styles.coloured : ""
      }`}
    >
      <div
        className={`${styles.header} ${
          props.showGenotype ? styles["genotype-included"] : ""
        }`}
        onClick={() => setIsAdditionalInfoVisible(!isAdditionalInfoVisible)}
      >
        <div className={styles["header-content"]}>{props.vus.chromosome}</div>
        <div className={styles["header-content"]}>
          {props.vus.chromosomePosition}
        </div>
        <div className={styles["header-content"]}>{props.vus.gene}</div>
        <div className={styles["header-content"]}>{props.vus.refAllele}</div>
        <div className={styles["header-content"]}>
          {props.vus.observedAllele}
        </div>
        {props.showGenotype && (
          <div className={styles["header-content"]}>{props.vus.genotype}</div>
        )}
        <div className={styles["header-content"]}>
          {props.vus.rsidDbsnpVerified ? props.vus.rsid : "-"}
        </div>
        <div className={styles.pills}>
          <div
            className={`${styles.pill} ${styles.dbsnp} ${
              props.vus.rsidDbsnpVerified
                ? styles.active
                : props.vus.rsid.length > 0
                ? styles["unverified-rsid"]
                : styles.disabled
            }`}
            onClick={(e) => {
              if (props.vus.rsidDbsnpVerified) {
                e.stopPropagation();
                openInNewWindow(
                  `https://www.ncbi.nlm.nih.gov/snp/${props.vus.rsid}`
                );
              }
            }}
          >
            dbSNP
          </div>
          <div
            className={`${styles.pill} ${styles.clinvar} ${
              props.vus.clinvarClassification.length === 0
                ? styles.disabled
                : props.vus.rsid.length > 0 && !props.vus.rsidDbsnpVerified
                ? styles["unverified-rsid"]
                : styles.active
            }`}
            onClick={(e) => {
              if (props.vus.clinvarErrorMsg.length === 0) {
                e.stopPropagation();
                openInNewWindow(
                  `https://www.ncbi.nlm.nih.gov/clinvar/variation/${props.vus.clinvarUid}`
                );
              }
            }}
          >
            ClinVar
          </div>
          {props.vus.rsidDbsnpVerified && (
            <div
              className={styles["pub-icon"]}
              onClick={() =>
                (window.location.href = `/publication-search?rsid=${props.vus.rsid}`)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                xmlSpace="preserve"
              >
                <path d="M29.975 23.997c0-.204-.004-.408-.002-.611.004-.419.029-.838.027-1.256-.002-.891-.021-1.78-.041-2.669-.014-.615.008-1.228-.01-1.844-.008-.33-.027-.66-.037-.99-.008-.301-.002-.604-.004-.906-.006-1.359-.115-2.713-.116-4.072 0-.604 0-1.209-.004-1.813-.004-.631.039-1.265.078-1.894.027-.431-.38-.792-.794-.792-.028 0-.05.013-.077.016a.823.823 0 0 0-.407-.133l-.041-.001c-.173 0-.346.032-.52.034l-.555.006c-.001-.168.002-.335-.002-.503a.802.802 0 0 0-.645-.765c-.014-.036-.017-.075-.037-.108-.085-.146-.264-.314-.443-.34a13.53 13.53 0 0 0-1.81-.109c-.693 0-1.387.036-2.079.068-.677.031-1.357.07-2.034.111-.629.037-1.252.08-1.867.213-.256.056-.518.109-.769.192-.32.109-.629.241-.932.388-.344.168-.639.424-.917.694a5.772 5.772 0 0 0-.584-.446 4.859 4.859 0 0 0-1.254-.551c-.637-.186-1.304-.26-1.966-.291-.668-.033-1.333-.087-2.003-.099-.753-.013-1.506-.015-2.261-.021-.672-.006-1.343-.027-2.015-.027-.152 0-.304.001-.457.004a.78.78 0 0 0-.728.553.722.722 0 0 0-.277.58c.006.127.006.253.012.38-.032 0-.062-.013-.095-.011l.05-.007c-.163.016-.332-.001-.497-.001a25.744 25.744 0 0 0-.786 0 .837.837 0 0 0-.766.524.763.763 0 0 0-.296.592c.006.78.023 1.56.016 2.341l-.019 2.079c-.009.797-.009 1.596-.011 2.396-.004.774.025 1.549.039 2.323.01.658.012 1.314.023 1.972.012.67.049 1.337.062 2.005.021 1.081.01 2.164.021 3.247.003.39.293.708.667.777.042.019.09.018.136.028h.002c.058.013.114.035.176.031.371-.023.737-.06 1.108-.089.398-.029.796-.043 1.195-.05.489-.01.98-.008 1.469-.006.26.002.52.004.78.002 1.432-.008 2.866-.021 4.301.029.155.005.312.007.469.011.02.235.065.464.107.694.027.149.056.25.124.398.148.324.522.472.856.472.186 0 .373-.002.557-.006 1.128-.019 2.251-.033 3.379-.025l.734-.002c.124.002.25.002.375.008.049.002.097.006.146.01.19.01.361-.045.532-.124.452-.21.54-.724.582-1.163.007-.081.012-.163.017-.244.473-.04.95-.05 1.425-.062.712-.017 1.426-.021 2.139-.027 1.432-.012 2.863.019 4.295.025.066.002.134.002.202.002.252 0 .506.005.758.022.04.036.074.079.121.107a.781.781 0 0 0 .596.078c.278-.076.441-.279.538-.54.058-.153.048-.33.045-.495-.003-.107-.001-.212-.001-.319zM9.36 6.953c.299.002.6.008.899.017.272.01.543.045.815.07.301.029.602.047.902.058.258.008.515.011.772.036.479.074.951.185 1.402.363.191.086.371.194.541.318.142.116.279.234.398.373l.046.063c.031.043.068.075.101.112.01.282.021.563.029.845.01.39.033.784.021 1.172-.01.367-.035.734-.062 1.098-.027.355-.027.708-.029 1.064a111.87 111.87 0 0 0-.006 2.168c.008.739.031 1.477.041 2.216.002.233-.017.464-.016.697.002.384.012.767.014 1.151.002.542-.025 1.079.008 1.621.025.388.309.716.716.716.19 0 .373-.078.507-.21.12-.12.235-.332.21-.507-.025-.196-.016-.396-.021-.594-.006-.303-.012-.606-.004-.91.016-.576.039-1.155.008-1.731a33.297 33.297 0 0 1-.037-2.166c.006-.734.035-1.469.025-2.203-.01-.759.052-1.52.103-2.278.049-.753.049-1.511.039-2.267.185-.198.37-.399.574-.573.183-.125.377-.222.579-.318a6.257 6.257 0 0 1 1.298-.343 17.1 17.1 0 0 1 1.536-.13c.607-.021 1.215-.097 1.822-.132 1.099-.064 2.2-.086 3.295.03.032.676.083 1.355.069 2.03-.012.66-.002 1.316.033 1.974.039.728.052 1.456.07 2.181.017.741.039 1.483.045 2.224.004.664-.002 1.329.006 1.993.006.532.047 1.062.06 1.593.01.417.008.836-.012 1.254-.013.319.008.644-.01.964-.173-.001-.346-.007-.52-.01-.309-.004-.619-.016-.928-.023-.307-.008-.611-.008-.916-.021-.365-.016-.728-.045-1.093-.058-.5-.019-1.001-.034-1.503-.034a22.4 22.4 0 0 0-.685.01c-.349.012-.703.018-1.05.06a12.91 12.91 0 0 0-1.108.18c-.476.097-.945.256-1.403.413a2.85 2.85 0 0 0-.479.196c-.103.058-.196.128-.291.198-.09.065-.169.145-.256.214-.112-.084-.226-.165-.335-.248a2.964 2.964 0 0 0-.512-.316 5.423 5.423 0 0 0-.671-.268c-.303-.105-.611-.151-.93-.192a9.986 9.986 0 0 0-1.316-.078c-.762 0-1.527.06-2.286.086-.736.025-1.471.043-2.207.076-.373.017-.743.043-1.116.052-.134.004-.269.006-.404.008a.575.575 0 0 0 .089-.337c-.035-.268-.027-.547-.031-.815-.004-.237-.006-.475-.014-.712-.021-.666-.058-1.331-.089-1.997-.035-.741-.047-1.485-.068-2.226-.021-.736-.066-1.471-.093-2.207a55.756 55.756 0 0 1 0-3.22c.012-.483 0-.968.006-1.452.006-.418.01-.839.009-1.261a77.699 77.699 0 0 1 3.413-.057zm17.809 16.72c-.633 0-1.263-.002-1.894 0-1.401.004-2.804.006-4.208-.008-.276-.004-.549.002-.825.004-.078.002-.153 0-.231 0-.32-.004-.65-.006-.955.068a.97.97 0 0 0-.454.268c-.177.194-.246.408-.268.664-.01.101-.016.204-.016.305-.001.086-.001.172-.003.257l-.11.003c-.182.006-.363.017-.543.019-.423.006-.844.004-1.265.004-.454 0-.908-.002-1.362-.014-.322-.009-.646-.005-.968-.025-.012-.05-.022-.1-.032-.15-.02-.205-.031-.41-.06-.615a.953.953 0 0 0-.441-.656c-.206-.132-.444-.148-.681-.146-.536.002-1.069-.017-1.605-.021h-1.13c-.377.002-.751.002-1.128 0-.603-.001-1.205-.008-1.807-.008l-.526.002c-.982.01-1.963.022-2.944.057l-.003-.104c-.01-.357-.008-.714-.008-1.071 0-.704-.021-1.409-.041-2.113a80.21 80.21 0 0 1-.016-2.403c.006-.759-.033-1.518-.045-2.275-.023-1.32-.008-2.641-.01-3.961a82.018 82.018 0 0 0-.025-1.646c-.012-.498-.004-.995 0-1.492l.294-.01c.165-.008.332-.031.497-.019a1.051 1.051 0 0 0-.038-.006c.046.003.09-.004.135-.007.001.084.007.169.008.254.004.72-.023 1.442-.027 2.162-.004.737.006 1.475.033 2.212.027.747.064 1.494.089 2.242.035 1.031.066 2.059.109 3.09.016.396.049.792.05 1.19.002.219.019.437.023.656.002.175-.004.349.004.524.008.17.076.322.172.448a.768.768 0 0 0-.445.693c0 .409.357.809.786.784.741-.041 1.483-.109 2.226-.147a60.266 60.266 0 0 1 2.127-.07c.607-.01 1.211-.066 1.817-.081.279-.008.557-.008.836 0 .306.008.61.01.915.047l.139.019c.287.044.555.129.823.233.177.084.345.188.5.306-.054-.041-.107-.081-.161-.124.184.142.386.285.545.454a.733.733 0 0 0 .339.191c.008.009.011.022.02.031a.797.797 0 0 0 1.118 0c.229-.229.468-.452.716-.659.03-.02.061-.039.093-.056a9.892 9.892 0 0 1 1.993-.541c.268-.033.538-.054.809-.071.342-.021.683-.05 1.025-.054.685-.008 1.37-.012 2.053.043.332.027.666.037.998.054.291.014.576.027.866.023.206-.004.413 0 .621.004.363.008.724.014 1.085-.023.202-.021.371-.066.518-.215a.726.726 0 0 0 .212-.503.735.735 0 0 0 .189-.318c.062-.239.029-.51.029-.755 0-.204.006-.406.01-.607.012-.45-.004-.9-.027-1.351-.031-.594-.082-1.184-.095-1.778-.016-.706.004-1.413 0-2.119-.006-.697-.017-1.395-.031-2.092-.012-.685-.01-1.368-.043-2.053a44.26 44.26 0 0 1-.048-1.857v-.083c.266-.012.533-.021.799-.029-.002.5.005 1-.001 1.501-.008.763-.019 1.525-.008 2.286.008.681.043 1.359.074 2.038.029.642.019 1.289.052 1.931.033.664.066 1.328.07 1.991.004.501-.008 1.003.004 1.506.021.895.05 1.795.029 2.69-.008.324-.027.648-.031.972l-.001.114c-.43-.004-.86-.003-1.29-.004zM19.682 11.7a.777.777 0 0 1 0-1.096c.155-.155.334-.208.547-.227.398-.039.796-.068 1.195-.085.326-.014.652-.019.978-.043.219-.014.439-.023.658-.039.16-.011.317-.027.477-.027h.026a.764.764 0 0 1 .755.755c0 .2-.08.394-.219.534-.151.151-.33.206-.536.221-.175.014-.351.029-.528.031a6.865 6.865 0 0 1-.287 0 8.611 8.611 0 0 0-.394.002c-.334.012-.666.052-1 .083-.375.037-.751.078-1.126.118-.193.02-.415-.095-.546-.227zm4.815 1.66c0 .408-.357.809-.784.784a16.86 16.86 0 0 0-1.525-.006c-.627.021-1.254.068-1.881.105-.443.027-.813-.39-.813-.813 0-.458.371-.792.813-.811.627-.031 1.254-.037 1.881-.031.507.004 1.021.019 1.525-.014l.041-.001c.409 0 .743.392.743.787zm-.073 2.496c0 .425-.361.8-.794.792-.184-.004-.367-.021-.551-.031-.264-.016-.532-.008-.796-.006-.559.006-1.116.041-1.675.066-.433.019-.796-.376-.796-.796 0-.443.363-.782.796-.796.559-.016 1.116.012 1.675.014.264.002.532.01.796-.006.184-.01.367-.027.551-.031h.013a.802.802 0 0 1 .781.794zM7.471 10.805c0-.437.363-.796.796-.798h.158c.795 0 1.591.026 2.384.031.239.002.477-.004.714-.021.268-.019.518.039.78.083.186.033.365.194.456.349.103.177.13.39.076.586-.083.303-.402.592-.734.559-.202-.019-.406-.047-.607-.054a14.322 14.322 0 0 0-.718 0c-.836.012-1.673.043-2.509.06-.433.01-.796-.368-.796-.795zm5.499 2.631c0 .398-.357.817-.78.78-.246-.021-.493-.004-.737-.025-.291-.023-.584-.025-.875-.029-.765-.014-1.535.056-2.298.113-.431.033-.794-.386-.794-.794 0-.452.363-.769.794-.794.767-.045 1.531-.039 2.298-.037.301 0 .602-.012.902-.023l.104-.002c.202 0 .404.017.606.031.423.025.78.334.78.78zm-.781 1.992a.81.81 0 0 0-.385-.011c-.432.038-.868.005-1.299-.012a86.39 86.39 0 0 0-1.9-.052h-.016c-.454 0-.828.396-.828.844 0 .46.384.844.844.844.633.002 1.265-.01 1.9-.029.491-.014.978-.039 1.469.006.204.019.433-.097.573-.237a.816.816 0 0 0 .239-.573.813.813 0 0 0-.597-.78zm-.431 0-.047.006.051-.007-.004.001z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles["additional-info"]} ${
          isAdditionalInfoVisible ? styles["visible-additional-info"] : ""
        }`}
      >
        {/*TODO: Next to is RSID verified do info icon - on hover show what info was compared. Same for clinvar*/}
        <div className={styles["additional-info-content"]}>
          {props.showZygosityQty && (
            <>
              <p>Num of Homozygous samples: {props.vus.numHomozygous}</p>
              <p>Num of Heterozygous samples: {props.vus.numHeterozygous}</p>
            </>
          )}
          <div
            className={`${styles["info-container"]} ${styles["dbsnp-info"]} ${
              props.vus.rsidDbsnpVerified
                ? ""
                : props.vus.rsid.length > 0
                ? styles["unverified-rsid"]
                : styles.disabled
            }`}
          >
            <p className={styles["info-container-title"]}>dbSnp</p>

            <div className={styles.info}>
              {props.vus.rsid.length > 0 ? (
                <>
                  <div className={styles.information}>
                    <div className={styles["info-title"]}>
                      Is RSID verified:
                    </div>
                    {props.vus.rsidDbsnpVerified.toString()}
                  </div>
                  {!props.vus.rsidDbsnpVerified && (
                    <>
                      {props.vus.rsid !== "NORSID" && (
                        <div className={styles.information}>
                          <div className={styles["info-title"]}>
                            Suggested RSID:
                          </div>
                          <a
                            href={`https://www.ncbi.nlm.nih.gov/snp/${props.vus.rsid}`}
                            target="_blank"
                          >
                            {props.vus.rsid}
                          </a>
                        </div>
                      )}
                      <div className={styles.information}>
                        <div className={styles["info-title"]}>
                          Error message:
                        </div>
                        {props.vus.rsid === "NORSID"
                          ? "No RSID found."
                          : props.vus.rsidDbsnpErrorMsgs}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className={styles.information}>
                  No valid RSID found for this variant.
                </div>
              )}
            </div>
          </div>
          <div
            className={`${styles["info-container"]} ${styles["clinvar-info"]} ${
              props.vus.clinvarClassification.length === 0
                ? styles.disabled
                : props.vus.rsid.length > 0 && !props.vus.rsidDbsnpVerified
                ? styles["unverified-rsid"]
                : ""
            }`}
          >
            <p className={styles["info-cotainer-title"]}>
              ClinVar{" "}
              {props.vus.clinvarClassification.length > 0 &&
                !props.vus.rsidDbsnpVerified &&
                "of suggested dbSNP RSID"}
            </p>
            <div className={styles.info}>
              {props.vus.clinvarClassification.length > 0 ? (
                <>
                  <div className={styles.information}>
                    <div className={styles["info-title"]}>Classification:</div>
                    {props.vus.clinvarClassification}
                  </div>
                  <div className={styles.information}>
                    <div className={styles["info-title"]}>Review status:</div>
                    {props.vus.clinvarClassificationReviewStatus}
                  </div>
                  <div className={styles.information}>
                    <div className={styles["info-title"]}>Last evaluated:</div>
                    {props.vus.clinvarClassificationLastEval}
                  </div>
                  <div className={styles.information}>
                    <div className={styles["info-title"]}>Canonical SPDI:</div>
                    {props.vus.clinvarCanonicalSpdi}
                  </div>
                </>
              ) : props.vus.clinvarErrorMsg.length > 0 ? (
                <div className={styles.information}>
                  <div className={styles["info-title"]}>Error message:</div>
                  {props.vus.clinvarErrorMsg}
                </div>
              ) : (
                <div className={styles.information}>
                  No Clinvar entry found based on dbSNP's RSID
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function openInNewWindow(url: string) {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  }
};

ViewVus.defaultProps = {
  showGenotype: false,
  showZygosityQty: false,
};

export default ViewVus;
