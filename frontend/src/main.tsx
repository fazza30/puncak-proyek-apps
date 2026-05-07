import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />

				<Toaster
					position="top-center"
					richColors
					toastOptions={{
						classNames: {
							toast: "bg-[#1E1E2E] text-white border border-[#33334D] shadow-lg",
							description: "text-gray-400",
							actionButton: "bg-blue-500 text-white",
							cancelButton: "bg-gray-500 text-white",
						},
					}}
				/>
			</QueryClientProvider>
		</Provider>
	</StrictMode>,
);
