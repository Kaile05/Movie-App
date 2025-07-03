import Link from "next/link"

export default function Nav(){
  return (
    <div className="w-full bg-slate-800 h-10 justify-center items-center">
      <Link>
        <h1 className="text-center">MVY</h1>
      </Link>
    </div>
  )
}