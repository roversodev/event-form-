import Link from "next/link";
import React from "react";

const LogoEF = (props: { url?: string; }) => {
    const { url = "/" } = props;
    return (
        <div
            className="flex items-center justify-center
  sm:justify-start
    "
        >
            <Link href={url} className="flex items-center gap-2">
                <div
                    className="font-bold size-[30px] text-gray-50
          rounded-lg flex items-center
             justify-center bg-gradient-to-br
              from-purple-500 to-primary to-90%
             !font-mono italic
                  "
                    style={{ fontSize: "19px" }}
                >
                    F
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent bg-[length:200%_auto] hover:bg-right transition-all duration-500">
                    EventForm+
                </span>
            </Link>
        </div>
    );
};

export default LogoEF;