import Link from "next/link";

export default function FloatingActionButton(props) {
    return (
        <Link
            href={props.onClick ? "" : props.href}
            style={{
                position: "absolute",
                bottom: 15,
                right: 15,
                width: 60,
                height: 60,
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
            }}
            onClick={props.onClick}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img color="white" width={30} height={30} src={`/${props.icon}`} alt="icon" />
        </Link>
    );
}
