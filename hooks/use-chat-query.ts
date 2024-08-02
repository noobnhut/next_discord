import queryString from "query-string";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProp {
    queryKey: string,
    apiUrl: string,
    paramKey: "channelId" | "conversationId",
    paramValue: string
}
const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProp) => {
    const { isConnected } = useSocket()
    const params = useParams()
    const fetchMessengers = async ({ pageParam = undefined }) => {
        const url = queryString.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
            },
        }, { skipNull: true });
        const res = await fetch(url)
        return res.json();
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessengers,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: undefined,
    });
    return {
        data, fetchNextPage, hasNextPage, isFetchingNextPage, status
    }
}

export default useChatQuery;