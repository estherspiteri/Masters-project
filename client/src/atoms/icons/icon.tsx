import React from "react";
import styles from "./icon.module.scss";

export type IconName =
  | "add"
  | "add-outline"
  | "asc"
  | "bin"
  | "checkmark"
  | "chev-down"
  | "chev-right-circle"
  | "close"
  | "desc"
  | "document"
  | "edit"
  | "external-link"
  | "file-upload"
  | "file-process"
  | "left-arrow-circle"
  | "logout"
  | "options"
  | "profile"
  | "publication"
  | "remove"
  | "save"
  | "search"
  | "sort"
  | "warning";

type IconProps = {
  name: IconName;
  width?: number;
  height?: number;
} & React.SVGProps<SVGSVGElement>;

const Icon: React.FunctionComponent<IconProps> = (props: IconProps) => {
  return <svg {...props}>{getSvg(props.name)}</svg>;

  function getSvg(name: IconName) {
    switch (name) {
      case "add": {
        return (
          <svg
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M915.744 213v702.744H213v87.842h702.744v702.744h87.842v-702.744h702.744v-87.842h-702.744V213z"
              fill-rule="evenodd"
            ></path>
          </svg>
        );
      }
      case "add-outline": {
        return (
          <svg
            viewBox="7.5 7.5 49 49"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            fill="none"
            stroke={props.fill}
            strokeWidth={2}
          >
            <circle cx="32" cy="32" r="24" />
            <line x1="20" y1="32" x2="44" y2="32" />
            <line x1="32" y1="20" x2="32" y2="44" />
          </svg>
        );
      }
      case "asc": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M7.931 9h8.138c.605 0 .908 0 1.049-.12a.5.5 0 0 0 .173-.42c-.014-.183-.228-.397-.657-.826l-4.068-4.068c-.198-.198-.297-.297-.412-.334a.5.5 0 0 0-.309 0c-.114.037-.213.136-.41.334l-4.07 4.068c-.428.429-.642.643-.656.827a.5.5 0 0 0 .173.42C7.022 9 7.325 9 7.932 9" />
          </svg>
        );
      }
      case "bin": {
        return (
          <svg
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M11.849 22.692a.48.48 0 0 1-.526-.428l-.856-8.19a.48.48 0 0 1 .425-.53l.476-.05a.48.48 0 0 1 .526.428l.856 8.19a.48.48 0 0 1-.425.53zm4.304-.05a.48.48 0 0 1-.425-.53l.856-8.19a.48.48 0 0 1 .526-.428l.475.05a.48.48 0 0 1 .426.53l-.856 8.19a.48.48 0 0 1-.526.428z" />
            <path
              clip-rule="evenodd"
              d="M11.923 1c-.574 0-1.092.344-1.319.875L9.543 4.37h-4.63A1.92 1.92 0 0 0 3 6.296v2.408c0 .981.73 1.791 1.672 1.91L7.63 26.227c.09.45.482.774.938.774h11.784a.96.96 0 0 0 .946-.82l2.15-15.584A1.92 1.92 0 0 0 25 8.704V6.296a1.92 1.92 0 0 0-1.913-1.926h-4.63l-1.063-2.495A1.44 1.44 0 0 0 16.075 1zm4.452 3.37-.367-.86a.96.96 0 0 0-.879-.584h-2.26a.96.96 0 0 0-.879.584l-.366.86zm5.094 6.682a.4.4 0 0 0-.397-.455l-13.958.032a.4.4 0 0 0-.392.473L9.198 24.26a1 1 0 0 0 .983.815h8.475a1 1 0 0 0 .99-.863zm.661-2.348a.96.96 0 0 0 .957-.963v-.482a.96.96 0 0 0-.957-.963H5.87a.96.96 0 0 0-.957.963v.482a.96.96 0 0 0 .957.963z"
              fill-rule="evenodd"
            />
          </svg>
        );
      }
      case "checkmark": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.707 6.293a1 1 0 0 1 0 1.414L10.414 17a2 2 0 0 1-2.828 0l-4.293-4.293a1 1 0 1 1 1.414-1.414L9 15.586l9.293-9.293a1 1 0 0 1 1.414 0Z"
            />
          </svg>
        );
      }
      case "chev-down": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M8.65 10.85a.495.495 0 0 1 .7-.7L12 12.79l2.65-2.64a.495.495 0 0 1 .7.7l-3 3a.49.49 0 0 1-.7 0Z" />
          </svg>
        );
      }
      case "chev-right-circle": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M13.85 11.65a.49.49 0 0 1 0 .7l-3 3a.495.495 0 0 1-.7-.7L12.79 12l-2.64-2.65a.495.495 0 0 1 .7-.7Z" />
            <path d="M12 2.067A9.933 9.933 0 1 1 2.067 12 9.944 9.944 0 0 1 12 2.067m0 18.866A8.933 8.933 0 1 0 3.067 12 8.943 8.943 0 0 0 12 20.933" />
          </svg>
        );
      }
      case "close": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="m16 16-4-4m0 0L8 8m4 4 4-4m-4 4-4 4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      }
      case "desc": {
        return (
          <svg
            viewBox="0 0 24 24"
            {...props}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.069 15H7.93c-.606 0-.908 0-1.049.12a.5.5 0 0 0-.173.42c.014.183.228.397.657.826l4.068 4.068c.198.198.297.297.411.334.1.033.209.033.31 0 .114-.037.213-.136.41-.334l4.07-4.068c.428-.429.642-.643.656-.827a.5.5 0 0 0-.174-.42C16.978 15 16.675 15 16.07 15Z" />
          </svg>
        );
      }
      case "document": {
        return (
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M9.069 2.672V17.6H2.672v8.718c0 2.129 1.983 3.01 3.452 3.01H26.13c1.616 0 3.199-1.572 3.199-3.199V2.672H9.07zm-2.945 25.59c-.664 0-2.385-.349-2.385-1.944v-7.652H9.07v7.192c0 .714-.933 2.404-2.404 2.404h-.542zm22.138-2.133c0 1.036-1.096 2.133-2.133 2.133H9.016c.718-.748 1.119-1.731 1.119-2.404V3.738h18.126v22.391z" />
            <path d="M12.268 5.871h13.861v1.066H12.268V5.871zm0 14.394h13.861v1.066H12.268v-1.066zm0 3.732h13.861v1.066H12.268v-1.066zM26.129 9.602H12.268v7.997h13.861V9.602zm-1.066 6.931H13.334v-5.864h11.729v5.864z" />
          </svg>
        );
      }
      case "edit": {
        return (
          <svg
            viewBox="0 -0.5 21 21"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M0 20h21v-1.99H0zm10.334-5.968H6.3V9.95L16.63 0 21 4.116z"
              fill-rule="evenodd"
            />
          </svg>
        );
      }
      case "external-link": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M18 20.75H6A2.75 2.75 0 0 1 3.25 18V6A2.75 2.75 0 0 1 6 3.25h6a.75.75 0 1 1 0 1.5H6A1.25 1.25 0 0 0 4.75 6v12A1.25 1.25 0 0 0 6 19.25h12A1.25 1.25 0 0 0 19.25 18v-6a.75.75 0 1 1 1.5 0v6A2.75 2.75 0 0 1 18 20.75m2-12a.76.76 0 0 1-.75-.75V4.75H16a.75.75 0 1 1 0-1.5h4a.76.76 0 0 1 .75.75v4a.76.76 0 0 1-.75.75" />
            <path d="M13.5 11.25A.75.75 0 0 1 13 10l6.5-6.5a.75.75 0 1 1 1.06 1.06L14 11a.74.74 0 0 1-.5.25" />
          </svg>
        );
      }
      case "file-process": {
        return (
          <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M12 0H5v6h.7l.2.7.1.1V1h5v4h4v9H9l.3.5-.5.5H16V4l-4-4zm0 4V1l3 3h-3zm-6.5 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            <path d="M7.9 12.4 9 12v-1l-1.1-.4c-.1-.3-.2-.6-.4-.9l.5-1-.7-.7-1 .5c-.3-.2-.6-.3-.9-.4L5 7H4l-.4 1.1c-.3.1-.6.2-.9.4l-1-.5-.7.7.5 1.1c-.2.3-.3.6-.4.9L0 11v1l1.1.4c.1.3.2.6.4.9l-.5 1 .7.7 1.1-.5c.3.2.6.3.9.4L4 16h1l.4-1.1c.3-.1.6-.2.9-.4l1 .5.7-.7-.5-1.1c.2-.2.3-.5.4-.8zm-3.4 1.1c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
        );
      }
      case "file-upload": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            fill="transparent"
          >
            <path
              d="M12 16v-6m0 0-3 2m3-2 3 2M3 6v10.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h11.606c1.118 0 1.677 0 2.104-.218.377-.192.683-.498.875-.874C21 18.48 21 17.92 21 16.8V9.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 6 18.92 6 17.8 6H12M3 6h9M3 6a2 2 0 0 1 2-2h3.675c.489 0 .734 0 .964.055.204.05.399.13.578.24.202.124.375.297.72.643L12 6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      }
      case "left-arrow-circle": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            {...props}
          >
            <path
              d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm5 9h-5m-4.63.69 3.13 2.14a1 1 0 0 0 1.5-.69V9.86a1 1 0 0 0-1.5-.69l-3.12 2.14a.82.82 0 0 0-.01 1.38Z"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 1.5,
              }}
            />
          </svg>
        );
      }
      case "logout": {
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      }
      case "options": {
        return (
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M12.15 28.012v-.85c.019-.069.05-.131.063-.2.275-1.788 1.762-3.2 3.506-3.319 1.95-.137 3.6.975 4.137 2.787.069.238.119.488.181.731v.85c-.019.056-.05.106-.056.169-.269 1.65-1.456 2.906-3.081 3.262-.125.025-.25.063-.375.094h-.85c-.056-.019-.113-.05-.169-.056-1.625-.262-2.862-1.419-3.237-3.025-.037-.156-.081-.3-.119-.444zm7.888-24.024v.85c-.019.069-.05.131-.056.2-.281 1.8-1.775 3.206-3.538 3.319-1.944.125-3.588-1-4.119-2.819-.069-.231-.119-.469-.175-.7v-.85c.019-.056.05-.106.063-.162.3-1.625 1.244-2.688 2.819-3.194.206-.069.425-.106.637-.162h.85c.056.019.113.05.169.056 1.631.269 2.863 1.419 3.238 3.025l.113.437zm-.001 11.587v.85c-.019.069-.05.131-.063.2-.281 1.794-1.831 3.238-3.581 3.313-1.969.087-3.637-1.1-4.106-2.931q-.074-.29-.137-.581v-.85c.019-.069.05-.131.063-.2.275-1.794 1.831-3.238 3.581-3.319 1.969-.094 3.637 1.1 4.106 2.931q.074.298.137.588z" />
          </svg>
        );
      }
      case "profile": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth={0}
            {...props}
          >
            <path
              d="M14.3365 12.3466L14.0765 11.9195C13.9082 12.022 13.8158 12.2137 13.8405 12.4092C13.8651 12.6046 14.0022 12.7674 14.1907 12.8249L14.3365 12.3466ZM9.6634 12.3466L9.80923 12.8249C9.99769 12.7674 10.1348 12.6046 10.1595 12.4092C10.1841 12.2137 10.0917 12.022 9.92339 11.9195L9.6634 12.3466ZM4.06161 19.002L3.56544 18.9402L4.06161 19.002ZM19.9383 19.002L20.4345 18.9402L19.9383 19.002ZM16 8.5C16 9.94799 15.2309 11.2168 14.0765 11.9195L14.5965 12.7737C16.0365 11.8971 17 10.3113 17 8.5H16ZM12 4.5C14.2091 4.5 16 6.29086 16 8.5H17C17 5.73858 14.7614 3.5 12 3.5V4.5ZM7.99996 8.5C7.99996 6.29086 9.79082 4.5 12 4.5V3.5C9.23854 3.5 6.99996 5.73858 6.99996 8.5H7.99996ZM9.92339 11.9195C8.76904 11.2168 7.99996 9.948 7.99996 8.5H6.99996C6.99996 10.3113 7.96342 11.8971 9.40342 12.7737L9.92339 11.9195ZM9.51758 11.8683C6.36083 12.8309 3.98356 15.5804 3.56544 18.9402L4.55778 19.0637C4.92638 16.1018 7.02381 13.6742 9.80923 12.8249L9.51758 11.8683ZM3.56544 18.9402C3.45493 19.8282 4.19055 20.5 4.99996 20.5V19.5C4.70481 19.5 4.53188 19.2719 4.55778 19.0637L3.56544 18.9402ZM4.99996 20.5H19V19.5H4.99996V20.5ZM19 20.5C19.8094 20.5 20.545 19.8282 20.4345 18.9402L19.4421 19.0637C19.468 19.2719 19.2951 19.5 19 19.5V20.5ZM20.4345 18.9402C20.0164 15.5804 17.6391 12.8309 14.4823 11.8683L14.1907 12.8249C16.9761 13.6742 19.0735 16.1018 19.4421 19.0637L20.4345 18.9402Z"
              fill={props.fill ?? "black"}
            />
          </svg>
        );
      }
      case "publication": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            {...props}
          >
            <path d="M29.975 23.997c0-.204-.004-.408-.002-.611.004-.419.029-.838.027-1.256-.002-.891-.021-1.78-.041-2.669-.014-.615.008-1.228-.01-1.844-.008-.33-.027-.66-.037-.99-.008-.301-.002-.604-.004-.906-.006-1.359-.115-2.713-.116-4.072 0-.604 0-1.209-.004-1.813-.004-.631.039-1.265.078-1.894.027-.431-.38-.792-.794-.792-.028 0-.05.013-.077.016a.823.823 0 0 0-.407-.133l-.041-.001c-.173 0-.346.032-.52.034l-.555.006c-.001-.168.002-.335-.002-.503a.802.802 0 0 0-.645-.765c-.014-.036-.017-.075-.037-.108-.085-.146-.264-.314-.443-.34a13.53 13.53 0 0 0-1.81-.109c-.693 0-1.387.036-2.079.068-.677.031-1.357.07-2.034.111-.629.037-1.252.08-1.867.213-.256.056-.518.109-.769.192-.32.109-.629.241-.932.388-.344.168-.639.424-.917.694a5.772 5.772 0 0 0-.584-.446 4.859 4.859 0 0 0-1.254-.551c-.637-.186-1.304-.26-1.966-.291-.668-.033-1.333-.087-2.003-.099-.753-.013-1.506-.015-2.261-.021-.672-.006-1.343-.027-2.015-.027-.152 0-.304.001-.457.004a.78.78 0 0 0-.728.553.722.722 0 0 0-.277.58c.006.127.006.253.012.38-.032 0-.062-.013-.095-.011l.05-.007c-.163.016-.332-.001-.497-.001a25.744 25.744 0 0 0-.786 0 .837.837 0 0 0-.766.524.763.763 0 0 0-.296.592c.006.78.023 1.56.016 2.341l-.019 2.079c-.009.797-.009 1.596-.011 2.396-.004.774.025 1.549.039 2.323.01.658.012 1.314.023 1.972.012.67.049 1.337.062 2.005.021 1.081.01 2.164.021 3.247.003.39.293.708.667.777.042.019.09.018.136.028h.002c.058.013.114.035.176.031.371-.023.737-.06 1.108-.089.398-.029.796-.043 1.195-.05.489-.01.98-.008 1.469-.006.26.002.52.004.78.002 1.432-.008 2.866-.021 4.301.029.155.005.312.007.469.011.02.235.065.464.107.694.027.149.056.25.124.398.148.324.522.472.856.472.186 0 .373-.002.557-.006 1.128-.019 2.251-.033 3.379-.025l.734-.002c.124.002.25.002.375.008.049.002.097.006.146.01.19.01.361-.045.532-.124.452-.21.54-.724.582-1.163.007-.081.012-.163.017-.244.473-.04.95-.05 1.425-.062.712-.017 1.426-.021 2.139-.027 1.432-.012 2.863.019 4.295.025.066.002.134.002.202.002.252 0 .506.005.758.022.04.036.074.079.121.107a.781.781 0 0 0 .596.078c.278-.076.441-.279.538-.54.058-.153.048-.33.045-.495-.003-.107-.001-.212-.001-.319zM9.36 6.953c.299.002.6.008.899.017.272.01.543.045.815.07.301.029.602.047.902.058.258.008.515.011.772.036.479.074.951.185 1.402.363.191.086.371.194.541.318.142.116.279.234.398.373l.046.063c.031.043.068.075.101.112.01.282.021.563.029.845.01.39.033.784.021 1.172-.01.367-.035.734-.062 1.098-.027.355-.027.708-.029 1.064a111.87 111.87 0 0 0-.006 2.168c.008.739.031 1.477.041 2.216.002.233-.017.464-.016.697.002.384.012.767.014 1.151.002.542-.025 1.079.008 1.621.025.388.309.716.716.716.19 0 .373-.078.507-.21.12-.12.235-.332.21-.507-.025-.196-.016-.396-.021-.594-.006-.303-.012-.606-.004-.91.016-.576.039-1.155.008-1.731a33.297 33.297 0 0 1-.037-2.166c.006-.734.035-1.469.025-2.203-.01-.759.052-1.52.103-2.278.049-.753.049-1.511.039-2.267.185-.198.37-.399.574-.573.183-.125.377-.222.579-.318a6.257 6.257 0 0 1 1.298-.343 17.1 17.1 0 0 1 1.536-.13c.607-.021 1.215-.097 1.822-.132 1.099-.064 2.2-.086 3.295.03.032.676.083 1.355.069 2.03-.012.66-.002 1.316.033 1.974.039.728.052 1.456.07 2.181.017.741.039 1.483.045 2.224.004.664-.002 1.329.006 1.993.006.532.047 1.062.06 1.593.01.417.008.836-.012 1.254-.013.319.008.644-.01.964-.173-.001-.346-.007-.52-.01-.309-.004-.619-.016-.928-.023-.307-.008-.611-.008-.916-.021-.365-.016-.728-.045-1.093-.058-.5-.019-1.001-.034-1.503-.034a22.4 22.4 0 0 0-.685.01c-.349.012-.703.018-1.05.06a12.91 12.91 0 0 0-1.108.18c-.476.097-.945.256-1.403.413a2.85 2.85 0 0 0-.479.196c-.103.058-.196.128-.291.198-.09.065-.169.145-.256.214-.112-.084-.226-.165-.335-.248a2.964 2.964 0 0 0-.512-.316 5.423 5.423 0 0 0-.671-.268c-.303-.105-.611-.151-.93-.192a9.986 9.986 0 0 0-1.316-.078c-.762 0-1.527.06-2.286.086-.736.025-1.471.043-2.207.076-.373.017-.743.043-1.116.052-.134.004-.269.006-.404.008a.575.575 0 0 0 .089-.337c-.035-.268-.027-.547-.031-.815-.004-.237-.006-.475-.014-.712-.021-.666-.058-1.331-.089-1.997-.035-.741-.047-1.485-.068-2.226-.021-.736-.066-1.471-.093-2.207a55.756 55.756 0 0 1 0-3.22c.012-.483 0-.968.006-1.452.006-.418.01-.839.009-1.261a77.699 77.699 0 0 1 3.413-.057zm17.809 16.72c-.633 0-1.263-.002-1.894 0-1.401.004-2.804.006-4.208-.008-.276-.004-.549.002-.825.004-.078.002-.153 0-.231 0-.32-.004-.65-.006-.955.068a.97.97 0 0 0-.454.268c-.177.194-.246.408-.268.664-.01.101-.016.204-.016.305-.001.086-.001.172-.003.257l-.11.003c-.182.006-.363.017-.543.019-.423.006-.844.004-1.265.004-.454 0-.908-.002-1.362-.014-.322-.009-.646-.005-.968-.025-.012-.05-.022-.1-.032-.15-.02-.205-.031-.41-.06-.615a.953.953 0 0 0-.441-.656c-.206-.132-.444-.148-.681-.146-.536.002-1.069-.017-1.605-.021h-1.13c-.377.002-.751.002-1.128 0-.603-.001-1.205-.008-1.807-.008l-.526.002c-.982.01-1.963.022-2.944.057l-.003-.104c-.01-.357-.008-.714-.008-1.071 0-.704-.021-1.409-.041-2.113a80.21 80.21 0 0 1-.016-2.403c.006-.759-.033-1.518-.045-2.275-.023-1.32-.008-2.641-.01-3.961a82.018 82.018 0 0 0-.025-1.646c-.012-.498-.004-.995 0-1.492l.294-.01c.165-.008.332-.031.497-.019a1.051 1.051 0 0 0-.038-.006c.046.003.09-.004.135-.007.001.084.007.169.008.254.004.72-.023 1.442-.027 2.162-.004.737.006 1.475.033 2.212.027.747.064 1.494.089 2.242.035 1.031.066 2.059.109 3.09.016.396.049.792.05 1.19.002.219.019.437.023.656.002.175-.004.349.004.524.008.17.076.322.172.448a.768.768 0 0 0-.445.693c0 .409.357.809.786.784.741-.041 1.483-.109 2.226-.147a60.266 60.266 0 0 1 2.127-.07c.607-.01 1.211-.066 1.817-.081.279-.008.557-.008.836 0 .306.008.61.01.915.047l.139.019c.287.044.555.129.823.233.177.084.345.188.5.306-.054-.041-.107-.081-.161-.124.184.142.386.285.545.454a.733.733 0 0 0 .339.191c.008.009.011.022.02.031a.797.797 0 0 0 1.118 0c.229-.229.468-.452.716-.659.03-.02.061-.039.093-.056a9.892 9.892 0 0 1 1.993-.541c.268-.033.538-.054.809-.071.342-.021.683-.05 1.025-.054.685-.008 1.37-.012 2.053.043.332.027.666.037.998.054.291.014.576.027.866.023.206-.004.413 0 .621.004.363.008.724.014 1.085-.023.202-.021.371-.066.518-.215a.726.726 0 0 0 .212-.503.735.735 0 0 0 .189-.318c.062-.239.029-.51.029-.755 0-.204.006-.406.01-.607.012-.45-.004-.9-.027-1.351-.031-.594-.082-1.184-.095-1.778-.016-.706.004-1.413 0-2.119-.006-.697-.017-1.395-.031-2.092-.012-.685-.01-1.368-.043-2.053a44.26 44.26 0 0 1-.048-1.857v-.083c.266-.012.533-.021.799-.029-.002.5.005 1-.001 1.501-.008.763-.019 1.525-.008 2.286.008.681.043 1.359.074 2.038.029.642.019 1.289.052 1.931.033.664.066 1.328.07 1.991.004.501-.008 1.003.004 1.506.021.895.05 1.795.029 2.69-.008.324-.027.648-.031.972l-.001.114c-.43-.004-.86-.003-1.29-.004zM19.682 11.7a.777.777 0 0 1 0-1.096c.155-.155.334-.208.547-.227.398-.039.796-.068 1.195-.085.326-.014.652-.019.978-.043.219-.014.439-.023.658-.039.16-.011.317-.027.477-.027h.026a.764.764 0 0 1 .755.755c0 .2-.08.394-.219.534-.151.151-.33.206-.536.221-.175.014-.351.029-.528.031a6.865 6.865 0 0 1-.287 0 8.611 8.611 0 0 0-.394.002c-.334.012-.666.052-1 .083-.375.037-.751.078-1.126.118-.193.02-.415-.095-.546-.227zm4.815 1.66c0 .408-.357.809-.784.784a16.86 16.86 0 0 0-1.525-.006c-.627.021-1.254.068-1.881.105-.443.027-.813-.39-.813-.813 0-.458.371-.792.813-.811.627-.031 1.254-.037 1.881-.031.507.004 1.021.019 1.525-.014l.041-.001c.409 0 .743.392.743.787zm-.073 2.496c0 .425-.361.8-.794.792-.184-.004-.367-.021-.551-.031-.264-.016-.532-.008-.796-.006-.559.006-1.116.041-1.675.066-.433.019-.796-.376-.796-.796 0-.443.363-.782.796-.796.559-.016 1.116.012 1.675.014.264.002.532.01.796-.006.184-.01.367-.027.551-.031h.013a.802.802 0 0 1 .781.794zM7.471 10.805c0-.437.363-.796.796-.798h.158c.795 0 1.591.026 2.384.031.239.002.477-.004.714-.021.268-.019.518.039.78.083.186.033.365.194.456.349.103.177.13.39.076.586-.083.303-.402.592-.734.559-.202-.019-.406-.047-.607-.054a14.322 14.322 0 0 0-.718 0c-.836.012-1.673.043-2.509.06-.433.01-.796-.368-.796-.795zm5.499 2.631c0 .398-.357.817-.78.78-.246-.021-.493-.004-.737-.025-.291-.023-.584-.025-.875-.029-.765-.014-1.535.056-2.298.113-.431.033-.794-.386-.794-.794 0-.452.363-.769.794-.794.767-.045 1.531-.039 2.298-.037.301 0 .602-.012.902-.023l.104-.002c.202 0 .404.017.606.031.423.025.78.334.78.78zm-.781 1.992a.81.81 0 0 0-.385-.011c-.432.038-.868.005-1.299-.012a86.39 86.39 0 0 0-1.9-.052h-.016c-.454 0-.828.396-.828.844 0 .46.384.844.844.844.633.002 1.265-.01 1.9-.029.491-.014.978-.039 1.469.006.204.019.433-.097.573-.237a.816.816 0 0 0 .239-.573.813.813 0 0 0-.597-.78zm-.431 0-.047.006.051-.007-.004.001z" />
          </svg>
        );
      }
      case "remove": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            fill="none"
            stroke={props.fill}
            strokeWidth={2}
          >
            <path d="M6 12h12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        );
      }
      case "save": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18.172 1a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 23 5.828V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3zM4 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h1v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6h1a1 1 0 0 0 1-1V6.828a2 2 0 0 0-.586-1.414l-1.828-1.828A2 2 0 0 0 17.172 3H17v2a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V3zm13 18v-6a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6zM9 3h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"
            />
          </svg>
        );
      }
      case "search": {
        return (
          <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
              d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      }
      case "sort": {
        return (
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <path d="M16.069 15H7.93c-.606 0-.908 0-1.049.12a.5.5 0 0 0-.173.42c.014.183.228.397.657.826l4.068 4.068c.198.198.297.297.411.334a.5.5 0 0 0 .31 0c.114-.037.213-.136.41-.334l4.07-4.068c.428-.429.642-.643.656-.827a.5.5 0 0 0-.174-.42C16.978 15 16.675 15 16.07 15M7.931 9h8.138c.605 0 .908 0 1.049-.12a.5.5 0 0 0 .173-.42c-.014-.183-.228-.397-.657-.826l-4.068-4.068c-.198-.198-.297-.297-.412-.334a.5.5 0 0 0-.309 0c-.114.037-.213.136-.41.334l-4.07 4.068c-.428.429-.642.643-.656.827a.5.5 0 0 0 .173.42C7.022 9 7.325 9 7.932 9" />
          </svg>
        );
      }
      case "warning": {
        return (
          <svg viewBox="0 0 478.125 478.125" {...props}>
            <circle cx="239.904" cy="314.721" r="35.878" />
            <path d="M256.657,127.525h-31.9c-10.557,0-19.125,8.645-19.125,19.125v101.975c0,10.48,8.645,19.125,19.125,19.125h31.9 c10.48,0,19.125-8.645,19.125-19.125V146.65C275.782,136.17,267.138,127.525,256.657,127.525z" />
            <path d="M239.062,0C106.947,0,0,106.947,0,239.062s106.947,239.062,239.062,239.062c132.115,0,239.062-106.947,239.062-239.062 S371.178,0,239.062,0z M239.292,409.734c-94.171,0-170.595-76.348-170.595-170.596c0-94.248,76.347-170.595,170.595-170.595 s170.595,76.347,170.595,170.595C409.887,333.387,333.464,409.734,239.292,409.734z" />
          </svg>
        );
      }
      default:
        return <svg></svg>;
    }
  }
};

Icon.defaultProps = {
  width: 24,
  height: 24,
  fill: "black",
};

export default Icon;
