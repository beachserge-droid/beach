import { permanentRedirect } from "next/navigation"

export default function Checkout() {
    permanentRedirect("/shop")
}