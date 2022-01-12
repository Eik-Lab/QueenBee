function Footer() {
    return (
        <footer className=" bottom-0  h-auto py-4 mt-12 flex justify-center max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 bg-yellow-100 rounded-t-2xl">
            <p className="bottom-4 text-center w-full pb-4 text-sm font-mono">
                {new Date().getFullYear()}, Created by Eik-Lab
            </p>
        </footer>
    )

}

export default Footer
